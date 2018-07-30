
import * as _ from 'lodash';

import db from '../databases';
import { ReqPickQuiz, QuizQuestion, QuestionType } from './index';

export const QuizPoolModel = {
  
  pickQuizFromPool: async function(pick: ReqPickQuiz) {

  },

  getQuizQuestions: async function(quizNo: number): Promise<QuizQuestion[]> {
    let query: string = 
    `
      SELECT 
        *
      FROM 
        wedd_quiz_question 
      WHERE 
        quiz_no=?
      ORDER BY 
        seq ASC 
    `;
    let params: any[] = [quizNo];
    let rows: any[] = await db.query(query, params);

    let questions: QuizQuestion[] = _.map(rows, (elem: any) => {
      let type: QuestionType = null;
      if (elem.type === 'TEXT') type = QuestionType.TEXT;
      else if (elem.type === 'IMAGE') type = QuestionType.IMAGE;
      return {
        no: elem['no'],
        type: type,
        content: elem['content']
      };
    });
    return questions;
  }
}