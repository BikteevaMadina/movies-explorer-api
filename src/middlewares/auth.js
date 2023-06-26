const jwt = require('jsonwebtoken');

const AuthorizedError = require('../errors/AuthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const { MESSAGE_ERROR_AVTORISATION } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(new AuthorizedError(MESSAGE_ERROR_AVTORISATION));
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizedError(MESSAGE_ERROR_AVTORISATION));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
