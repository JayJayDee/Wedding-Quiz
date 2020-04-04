import { Router } from 'express';

import { wrapAsync } from '../wrap-async';
import { register } from '../../services/member-service';
import { WeddQuizError } from '../../errors';

export const memberRouter =
  () => {
    const router = Router();
    router.post('/', memberPost());
    router.get('/', memberGet());
    return router;
  };

/**
 * POST /member
 */
const memberPost = () =>
  wrapAsync(async (req, res) => {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      throw new WeddQuizError(`name,phone,email required`);
    }

    const resp = await register({ name, phone, email });
    const token = resp.token;
    const numQuizzes = resp.numQuizzes

    res.status(200).json({ token, numQuizzes });
  });

/**
 * GET /member
 */
const memberGet = () =>
  wrapAsync(async (req, res) => {
    res.status(200).json({});
  });