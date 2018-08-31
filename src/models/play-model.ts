
import * as _ from 'lodash';

import db, { TransactionExecutor } from '../databases';
import { config } from '../configs';
import { QuizPoolModel } from './quiz-pool-model';
import { Quiz, ReqSolveQuiz, ResSolveQuiz, InvalidMemberStatusError, QuizSolveFailError, QuizInvalidChoiceError, QuizStatus } from '.';
import { AllQuizPlayedError } from '../rest-endpoints/errors';
import log from '../loggers';

interface CorrectChoice {
  choice_no: number;
  quiz_no: number;
  play_no: number;
  content: string;
}

export const PlayModel = {

  getQuizPlayStatus: async function(memberNo: number): Promise<QuizStatus> {
    let query: string = 
    `
      SELECT 
        COUNT(p.no) AS num_all_quiz,
        SUM(IF(p.is_played=1 AND p.is_win=1, 1, 0)) AS num_correct,
        SUM(IF(p.is_played=1 AND p.is_win=0, 1, 0)) AS num_incorrect,
        SUM(IF(p.is_played=1, 1, 0)) AS num_played,
        SUM(q.difficulty * 10) AS sum_score
      FROM 
        wedd_quiz_play AS p
      INNER JOIN 
        wedd_quiz_pool AS q 
        ON p.quiz_no = q.no
      WHERE 
        p.member_no=?
    `;
    let params: any[] = [memberNo];
    let rows: any[] = await db.query(query, params);
    let rawResp: any = rows[0];
    
    let status: QuizStatus = {
      num_all_quiz: rawResp.num_all_quiz,
      num_played: rawResp.num_played,
      num_correct: rawResp.num_correct,
      num_incorrect: rawResp.num_incorrect,
      score_sum: rawResp.sum_score,
      is_ended: false
    };

    if (status.num_played === status.num_all_quiz) {
      status.is_ended = true;
    }
    return status;
  },

  generateQuizPlay: async function(memberNo: number): Promise<void> {
    let numQuizPerMember: number = config.play.numQuizPerMember;
    let queryArr: string[] = [];
    let params: any[] = [];

    let quizNos: number[] = await QuizPoolModel.getQuizNos();
    
    for (let i = 0; i < numQuizPerMember; i++) {
      let randIdx = Math.floor(Math.random() * (quizNos.length - 1));
      let value = quizNos[randIdx];
      quizNos = _.without(quizNos, quizNos[randIdx]);
      queryArr.push('(?,?,?,0,0)');
      params.push(value, memberNo, i);
    }

    let query: string = 
    `
      INSERT INTO 
        wedd_quiz_play
        (quiz_no, member_no, seq, is_played, is_win)
      VALUES 
        ${queryArr.join(',')}
    `; 
    return await db.query(query, params);
  },

  getPlayableQuiz: async function(memberNo: number): Promise<Quiz> {
    let query = 
    `
      SELECT  
        q.no
      FROM 
        wedd_quiz_pool q 
      INNER JOIN 
        (SELECT 
          quiz_no 
        FROM 
          wedd_quiz_play
        WHERE 
          member_no=? AND
          is_played=0
        ORDER BY 
          seq ASC 
        LIMIT 1) AS qp 
        ON q.no=qp.quiz_no
    `;
    let params: any[] = [memberNo];
    let rows: any[] = await db.query(query, params);
    if (rows.length === 0) {
      return null;
    }

    let quizNo: number = rows[0].no;
    return await QuizPoolModel.getQuiz(quizNo);
  },

  solveQuiz: async function(solve: ReqSolveQuiz): Promise<ResSolveQuiz> {
    let trans: TransactionExecutor = await db.transaction();
    
    try {
      //0. get user choices
      let verifyQuery: string = 
      `
        SELECT 
          c.no AS choice_no,
          c.is_answer,
          c.quiz_no,
          qno.play_no,
          c.content
        FROM 
          wedd_quiz_choice c 
        INNER JOIN 
          (
            SELECT 
              quiz_no,
              no AS play_no
            FROM 
              wedd_quiz_play 
            WHERE 
              is_played=0 AND 
              member_no=?
            ORDER BY 
              seq ASC 
            LIMIT 1
          ) AS qno
          ON c.quiz_no=qno.quiz_no 
      `;
      let params: any[] = [solve.member_no];
      let rows: any[] = await trans.query(verifyQuery, params);
      
      //1. check user-choice was invalid 
      if (rows.length === 0) {
        throw new AllQuizPlayedError();
      }
      if (!_.find(rows, (elem) => elem.choice_no == solve.choice_no)) {
        throw new QuizInvalidChoiceError(solve.choice_no);
      }

      //2. check is user-choice was correct
      let rawCorrect: any = _.find(rows, (row: any) => row.is_answer === 1);
      let correct: CorrectChoice = {
        choice_no: rawCorrect.choice_no,
        quiz_no: rawCorrect.quiz_no,
        play_no: rawCorrect.play_no,
        content: rawCorrect.content
      };

      let isWin: boolean = false;
      if (correct.choice_no == solve.choice_no) isWin = true;

      //3. update result 
      let updateQuery = 
      `
        UPDATE 
          wedd_quiz_play 
        SET 
          selected_choice_no=?,
          is_played=1,
          is_win=?,
          played_date=NOW()
        WHERE 
          no=? AND 
          selected_choice_no IS NULL AND 
          is_played=0
      `;
      let isWinInt: number = 0;
      if (isWin) isWinInt = 1;
      params = [solve.choice_no, isWinInt, correct.play_no];
      let resp: any = await trans.query(updateQuery, params);
      
      if (resp.affectedRows !== 1) {
        throw new QuizSolveFailError('failed to process solve request');
      }
      
      //5. select quiz info
      let descQuery = 
      `
        SELECT 
          *
        FROM 
          wedd_quiz_pool
        WHERE 
          no=?
      `;
      resp = await trans.query(descQuery, [rawCorrect.quiz_no]);
      if (resp.length !== 1) {
        throw new QuizSolveFailError('invalid quiz status');
      }
      let answerDesc: string = resp[0].answer_description;

      //5. transaction commit
      await trans.commit();

      //6. write result 
      let gainScore: number = 0;
      if (isWin === true) gainScore = parseInt(resp[0].difficulty) * 10;

      let result: ResSolveQuiz = {
        is_win: isWin,
        correct_answer: correct.content,
        answer_description: answerDesc,
        gain_score: gainScore
      };
      return result;

    } catch (err) {
      await trans.rollback();
      log.error(err);
      throw err;
    }
  }
}