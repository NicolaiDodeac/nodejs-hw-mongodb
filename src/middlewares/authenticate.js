import createHttpError from 'http-errors';
import { findSession, findUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return next(
      createHttpError(401, 'Authorization header must be Bearer type'),
    );
  }

  const session = await findSession({ accessToken });
  if (!session) {
    return next(createHttpError(401, 'You must login first'));
  }

  if (Date.now() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
