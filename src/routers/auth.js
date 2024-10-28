import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import { Router } from 'express';
import { userLoginSchema, userRegisterSchema } from '../validation/users.js';
import {
  loginController,
  logoutController,
  refreshSessionController,
  registerController,
} from '../controllers/auth.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(userRegisterSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(userLoginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshSessionController));

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
