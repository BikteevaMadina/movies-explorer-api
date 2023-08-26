const jwt = require('jsonwebtoken');

const AuthorizedError = require('../errors/AuthorizedError');

const { JWT_SECRET } = process.env;
const { MESSAGE_ERROR_AVTORISATION } = require('../utils/constants');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(new AuthorizedError(MESSAGE_ERROR_AVTORISATION));

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizedError(MESSAGE_ERROR_AVTORISATION));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
