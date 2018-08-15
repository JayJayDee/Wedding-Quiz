
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
        member_no,
        SUM(IF(is_win=1, 1, 0)) AS win_count,
        TIMESTAMPDIFF(SECOND, MIN(played_date), MAX(played_date)) AS play_time
      FROM 
        wedd_quiz_play
      WHERE 
        is_played=1 
      GROUP BY 
        member_no
      HAVING 
        COUNT(no) >= 7) AS quiz_enders
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
        play_time: row.play_time
      };
      rank++;
      return elem;
    });
    return elems;
  }
};