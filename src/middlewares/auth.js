const jwt = require('jsonwebtoken');

const AuthorizedError = require('../errors/AuthorizedError');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(new AuthorizedError('You need to log in'));

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthorizedError('You need to log in'));
  }
  req.user = payload;

  return next();
};

module.exports = auth;
