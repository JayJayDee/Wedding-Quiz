
import * as _ from 'lodash';

import db from '../databases';
import { config } from '../configs';
import { QuizPoolModel } from './quiz-pool-model';

export const PlayModel = {

  generateQuizPlay: async (memberNo: number) => {
    let numQuizPerMember: number = config.play.numQuizPerMember;
    let queryArr: string[] = [];
    let params: any[] = [];

    let quizNos: number[] = await QuizPoolModel.getQuizNos();
    //TODO: pick quizNos randomly.

    for (let i = 0; i < numQuizPerMember; i++) {
      queryArr.push('(?,?,?,0,0)');
    }

    let query: string = 
    `
      INSERT INTO 
        wedd_quiz_play
        (quiz_no, member_no, seq, is_played, is_win)
      VALUES 
        ${queryArr.join(',')}
    `; 
    
  }
}