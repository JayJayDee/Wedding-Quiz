import { Router } from 'express';

import { wrapAsync } from './utils';
import { rankService } from '../../services';

export const rankRouter =
  () => {
    const router = Router();
    router.get('/all', allRank());
    return router;
  };

const allRank = () =>
  wrapAsync(async (req, res) => {
    const ranks = await rankService.getGlobalRanks({ top: 10 });
    res.status(200).json({ ranks });
  });