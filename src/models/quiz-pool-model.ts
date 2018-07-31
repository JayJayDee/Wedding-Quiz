
import * as _ from 'lodash';

import db from '../databases';
import { QuizQuestion, QuestionType, QuizChoice, Quiz } from './index';

export const QuizPoolModel = {

  getQuizNos: async function(): Promise<number[]> {
    let query: string = 
    `
      SELECT 
        no
      FROM 
        wedd_quiz_pool
      ORDER BY 
        no ASC 
    `;
    let rows: any[] = await db.query(query);
    return _.map(rows, (elem: any) => {
      return elem.no;
    });
  },
  
  getQuiz: async function(quizNo: number): Promise<Quiz> {
    let query: string = 
    `
      SELECT 
        *
      FROM 
        wedd_quiz_pool
      WHERE 
        no=? 
    `;
    let params: any[] = [quizNo];
    let rows: any[] = await db.query(query, params);

    if (rows.length === 0) {
      return null;
    }
    let quiz: Quiz = {
      difficulty: rows[0]['difficulty'],
      choices: await this.getQuizChoices(quizNo),
      questions: await this.getQuizQuestions(quizNo) 
    };
    return quiz;
  },

  getQuizChoices: async function(quizNo: number): Promise<QuizChoice[]> {
    let query: string = 
    `
      SELECT 
        *
      FROM 
        wedd_quiz_choice
      WHERE 
        quiz_no=?
      ORDER BY 
        seq ASC 
    `;
    let params: any[] = [quizNo];
    let rows: any[] = await db.query(query, params);
    
    let choices: QuizChoice[] = _.map(rows, (elem: any) => {
      return {
        no: elem['no'],
        content: elem['content']
      };
    });
    return choices;
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
      if (elem['question_type'] === 'TEXT') type = QuestionType.TEXT;
      else if (elem['question_type'] === 'IMAGE') type = QuestionType.IMAGE;
      return {
        no: elem['no'],
        type: type,
        content: elem['content']
      };
    });
    return questions;
  }
}