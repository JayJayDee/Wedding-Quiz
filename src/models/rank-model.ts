
import * as _ from 'lodash';

import db from '../databases';
import { RankElement, MyRank } from '.';

export const RankModel = {

  getMyRank: async function(memberNo: number): Promise<MyRank> {
    let query = 
    `
    SET @cnt := 0;
    SELECT  
      enders.rank
    FROM 
      (SELECT 
        (@cnt := @cnt + 1) AS rank,
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
        COUNT(play.no) >= 7) AS enders
    WHERE 
      enders.member_no=?
    `;
    let params: any[] = [memberNo];
    let rows: any[] = await db.query(query, params);
    if (rows.length === 0) return null;
    return {
      rank: rows[0].rank
    };
  },

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
      score_sum DESC,
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