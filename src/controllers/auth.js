import createHttpError from 'http-errors';
import { login, logout, refreshSession, register } from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  await register(req.body);

  res.status(201).json({
    message: 'Successfully registered a user!',
  });
};
export const loginController = async (req, res) => {
  const session = await login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await logout(sessionId);
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    return res.status(204).send();
  }

  throw createHttpError(401, 'Session not found');
};
