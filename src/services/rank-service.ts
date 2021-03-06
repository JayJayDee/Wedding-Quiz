import { getConnection } from 'typeorm';

import { cfgMandantory } from '../configurator';

const NUM_QUIZ_PER_MEMBER = Number(cfgMandantory('NUM_QUIZ_PER_MEMBER'));

type GlobalRank = {
  rank: number;
  memberNo: number;
  name: string;
  phone: string;
  score: number;
  elapsedTime: number;
  completeDate: Date;
};

const increaser = (initial: number) => {
  let num = initial;
  return () => {
    const ret = num;
    num++;
    return ret;
  };
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
        ORDER BY
          score DESC,
          elapsedTime ASC,
          completeDate DESC
        LIMIT ?) AS r
      INNER JOIN
        member m ON m.no=r.memberNo
    `;
    const rows = await runner.query(sql, [ NUM_QUIZ_PER_MEMBER, top ]) as any[];
    await runner.release();

    const incr = increaser(1);
    const ranks: GlobalRank[] = rows.map((r) => ({
      rank: incr(),
      memberNo: r.memberNo,
      name: r.name,
      phone: r.phone,
      score: Number(r.score),
      elapsedTime: Number(r.elapsedTime),
      completeDate: r.completeDate
    }));
    return ranks;
  };

export const getMyRank =
  async ({ memberNo }: { memberNo: number }) => {
    // TODO: to be implemented
    return 1;
  };
