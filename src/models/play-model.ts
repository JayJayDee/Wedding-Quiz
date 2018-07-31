
import db from '../databases';

export const PlayModel = {

  generateQuizPlay: async (memberNo: number) => {
    let query: string = 
    `
      INSERT INTO 
        wedd_quiz_play
        (quiz_no, member_no, seq, is_played, is_win)
      VALUES 
        (?, ?, ?, 0, 0)
    `; 
    let params: any[] = [];
  }
}