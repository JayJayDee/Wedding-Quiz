
import * as _ from 'lodash';

import db from '../databases';
import { RankElement } from '.';

export const RankModel = {

  getGlobalRanks: async function(): Promise<RankElement[]> {
    let query = 
    `
    SELECT 
      m.name,
      m.phone,
      quiz_enders.*
    FROM 
      (SELECT 
        play.member_no,
        SUM(IF(play.is_win=1, 1, 0)) AS win_count,
        TIMESTAMPDIFF(SECOND, MIN(play.played_date), MAX(play.played_date)) AS play_time,
        SUM(IF(play.is_win=1, q.difficulty * 10, 0)) AS score_sum
      FROM 
        wedd_quiz_play AS play
      INNER JOIN 
        wedd_quiz_pool AS q ON q.no=play.quiz_no
      WHERE 
        play.is_played=1 
      GROUP BY 
        play.member_no
      HAVING 
        COUNT(play.no) >= 7) AS quiz_enders
    INNER JOIN 
      wedd_member m ON m.no=quiz_enders.member_no
    ORDER BY 
      win_count DESC,
      play_time ASC
    LIMIT 10
    `;
    let rows: any[] = await db.query(query);
    let rank = 1;
    let elems: RankElement[] = _.map(rows, (row: any) => {
      let elem: RankElement = {
        rank: rank,
        name: row.name,
        phone: row.phone,
        win_count: row.win_count,
        play_time: row.play_time,
        score_sum: row.score_sum
      };
      rank++;
      return elem;
    });
    return elems;
  }
};