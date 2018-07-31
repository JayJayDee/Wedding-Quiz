
import * as _ from 'lodash';

import db, { TransactionExecutor } from '../databases';
import { config } from '../configs';
import { QuizPoolModel } from './quiz-pool-model';
import { Quiz, ReqSolveQuiz, ResSolveQuiz, InvalidMemberStatusError, QuizSolveFailError } from '.';
import log from '../loggers';
import { BaseLogicalError, AllQuizPlayedError } from '../rest-endpoints/errors';

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
      let query: string = 
      `
        SELECT 
          c.quiz_no,
          qpno.play_no,
          IF(c.is_answer=1 AND c.no=?, 1, 0) AS is_win,
          rc.content AS correct_answer
        FROM 
          wedd_quiz_choice c 
        INNER JOIN 
          (SELECT 
            quiz_no,
            no AS play_no
          FROM 
            wedd_quiz_play qp
          WHERE 
            qp.member_no=? AND 
            qp.is_played=0
          ORDER BY 
            seq ASC 
          LIMIT 1) AS qpno 
          ON c.quiz_no=qpno.quiz_no
        INNER JOIN 
          wedd_quiz_choice rc 
          ON rc.quiz_no=c.quiz_no AND rc.is_answer=1 
        WHERE 
          c.no=?
      `;
      let params: any[] = [solve.choice_no, solve.member_no, solve.choice_no];
      let correctResp: any[] = await trans.query(query, params);
      if (correctResp.length === 0) {
        throw new AllQuizPlayedError();
      }
      let correctness: any = correctResp[0];
      
      query = 
      `
        UPDATE 
          wedd_quiz_play 
        SET 
          is_played=1,
          is_win=?,
          selected_choice_no=?
        WHERE 
          is_played=0 AND 
          selected_choice_no IS NULL AND
          no=?
      `;
      params = [correctness.is_win, solve.choice_no, correctness.play_no];
      let resp = await trans.query(query, params);
      if (resp.affectedRows !== 1) {
        throw new QuizSolveFailError(`failed to solve quiz:${correctness.quiz_no}`);
      }
      await trans.commit();

      let isWin = false;
      if (correctness.is_win === 1) isWin = true;

      let result: ResSolveQuiz = {
        is_win: isWin,
        is_ended: false, //TODO: must be calculated in query
        correct_answer: correctness.correct_answer
      };
      return result;

    } catch (err) {
      await trans.rollback();
      log.error(err);
      throw err;
    }
  }
}