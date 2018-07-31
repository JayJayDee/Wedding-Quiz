
import * as _ from 'lodash';

import db, { TransactionExecutor } from '../databases';
import { config } from '../configs';
import { QuizPoolModel } from './quiz-pool-model';
import { Quiz, ReqSolveQuiz, ResSolveQuiz, InvalidMemberStatusError, QuizSolveFailError, QuizInvalidChoiceError } from '.';
import { AllQuizPlayedError } from '../rest-endpoints/errors';
import log from '../loggers';

interface CorrectChoice {
  choice_no: number;
  quiz_no: number;
  play_no: number;
  content: string;
}

export const PlayModel = {

  getSolveStatus: async function(memberNo: number): Promise<void> {

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

      //4. check is all quiz ended
      let endCheckQuery = 
      `
        SELECT 
          SUM(IF(is_played=1, 1, 0)) AS played_count,
          COUNT(no) AS all_count 
        FROM 
          wedd_quiz_play 
        WHERE 
          member_no=? 
      `;
      params = [solve.member_no];
      resp = await trans.query(endCheckQuery, params);

      let isEnded: boolean = false;
      if (resp[0].played_count === resp[0].all_count) {
        isEnded = true;
      }

      //5. transaction commit
      await trans.commit();

      //6. write result 
      let result: ResSolveQuiz = {
        is_win: isWin,
        is_ended: isEnded,
        correct_answer: correct.content
      };
      return result;

    } catch (err) {
      await trans.rollback();
      log.error(err);
      throw err;
    }
  }
}