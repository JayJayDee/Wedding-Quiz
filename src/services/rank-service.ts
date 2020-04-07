import { getConnection } from 'typeorm';

import { cfgMandantory } from '../configurator';

const NUM_QUIZ_PER_MEMBER = Number(cfgMandantory('NUM_QUIZ_PER_MEMBER'));

type GlobalRank = {
  rank: number;
  memberNo: number;
  name: string;
  score: number;
  elapsedTime: number;
  completeDate: Date;
};

export const getGlobalRanks =
  async ({ top }: { top: number }): Promise<GlobalRank[]> => {
    const runner = getConnection().createQueryRunner();
    const sql =
    `
      SELECT
        m.name,
        m.phone,
        r.*
      FROM
        (SELECT
          p.memberNo,
          SUM(IF(c.correct = 1, 1, 0)) * 10 AS score,
          MAX(UNIX_TIMESTAMP(p.solvedDate)) - MIN(UNIX_TIMESTAMP(p.solvedDate)) AS elapsedTime,
          MAX(p.solvedDate) AS completeDate
        FROM
          play p
        INNER JOIN
          quiz_choice c ON c.no=p.choiceNo
        WHERE
          p.choiceNo IS NOT NULL
        GROUP BY
          p.memberNo
        HAVING
          COUNT(p.memberNo) >= ?
        LIMIT ?) AS r
      INNER JOIN
        member m ON m.no=r.memberNo
    `;
    const rows = await runner.query(sql, [ NUM_QUIZ_PER_MEMBER, top ]) as any[];
    console.log(rows);
    return [];
  };

export const getMyRank =
  async ({ memberNo }: { memberNo: number }) => {
    // TODO: to be implemented
    return 1;
  };
