import { Router } from 'express';

import { wrapAsync } from '../wrap-async';
import { register } from '../../services/member-service';
import { WeddQuizError } from '../../errors';

export const memberRouter =
  () => {
    const router = Router();
    router.post('/', registerMember());
    return router;
  };

const registerMember = () =>
  wrapAsync(async (req, res, next) => {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      throw new WeddQuizError(`name,phone,email required`);
    }

    const resp = await register({ name, phone, email });
    const token = resp.token;

    res.status(200).json({ token });
  });
