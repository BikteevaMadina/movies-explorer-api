const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;
const { REGEX_PASSWORD } = require('../utils/regexData');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizedError = require('../errors/AuthorizedError');
const ConflictError = require('../errors/ConflictError');
const {
  MESSAGE_ERROR_INCORRECT_ID,
  MESSAGE_ERROR_INCORRECT_DATA,
  MESSAGE_SUCCESSFUL_SIGNIN,
  MESSAGE_INCORRECT_MAIL_PASSWORD,
  MESSAGE_USER_REGISTRATED,
  MESSAGE_ERROR_USER_NOT_FOUND,
} = require('../utils/constants');

const User = require('../models/user');

function login(req, res, next) {
  const { email, password } = req.body;

  if (!REGEX_PASSWORD.test(password)) throw new BadRequestError('Пароль не соответствует регексу');

  User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '3d' },
        );
        return res.send({ token });
      }
      throw new AuthorizedError('401: неверная электронная почта или пароль');
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!REGEX_PASSWORD.test(password)) throw new BadRequestError(MESSAGE_INCORRECT_MAIL_PASSWORD);

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({ message: MESSAGE_SUCCESSFUL_SIGNIN }))
    .catch((err) => {
      if (err.code === 11000) next(new ConflictError(MESSAGE_USER_REGISTRATED));
      else if (err.name === 'ValidationError') { next(new BadRequestError(MESSAGE_ERROR_INCORRECT_DATA)); } else next(err);
    });
}

function getUserById(req, res, next) {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError(MESSAGE_ERROR_USER_NOT_FOUND);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(MESSAGE_ERROR_INCORRECT_ID));
      else next(err);
    });
}

function updateUser(req, res, next) {
  const { email, name } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    {
      email,
      name,
    },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь не найден');
    })
    .catch((err) => {
      if (err.code === 11000) return next(new ConflictError(MESSAGE_USER_REGISTRATED));
      if (err.name === 'CastError') return next(new BadRequestError(MESSAGE_ERROR_INCORRECT_ID));
      if (err.name === 'ValidationError') return next(new BadRequestError(MESSAGE_ERROR_INCORRECT_DATA));

      return next(err);
    });
}

module.exports = {
  updateUser,
  getUserById,
  createUser,
  login,
};
