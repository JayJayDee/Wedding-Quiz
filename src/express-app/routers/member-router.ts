import { Router } from 'express';
import { IsDefined } from 'class-validator';

import { wrapAsync, validate } from './utils';
import { register, get } from '../../services/member-service';
import { authorize } from '../authorization-handler';

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
class MemberPostParam {
  @IsDefined() public name: string;
  @IsDefined() public phone: string;
  @IsDefined() public email: string;
}
const memberPost = () => ([
  wrapAsync(async (req, res) => {
    const param: MemberPostParam = req.body;
    await validate(param, MemberPostParam);
    const { name, phone, email } = param;

    const resp = await register({ name, phone, email });
    const token = resp.token;
    const numQuizzes = resp.numQuizzes

    res.status(200).json({ token, numQuizzes });
  })
]);


/**
 * GET /member
 */
const memberGet = () => ([
  authorize(),
  wrapAsync(async (req, res) => {
    const member = await get({ no: 1 });
    res.status(200).json({ member });
  })
]);
