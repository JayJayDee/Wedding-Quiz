
import * as _ from 'lodash';

import db, { TransactionExecutor } from '../databases';
import { config } from '../configs';
import { QuizPoolModel } from './quiz-pool-model';
import { Quiz, ReqSolveQuiz, ResSolveQuiz } from '.';
import log from '../loggers';
import { BaseLogicalError } from '../rest-endpoints/errors';

export const PlayModel = {

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
      let resp = await trans.query('INSERT INTO wedd_test SET test_value=1');
      console.log(resp);
      
      resp = await trans.query('SELECT COUNT(no) AS cnt FROM wedd_test');
      console.log(resp);

      throw new BaseLogicalError('TEST_ERROR', 'test-message');
      await trans.commit();
    } catch (err) {
      await trans.rollback();
      log.error(err);
      throw err;
    }
    return null;
  }
}