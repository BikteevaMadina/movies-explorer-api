const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { NODE_ENV, JWT_SECRET } = process.env;
const { REGEX_PASSWORD } = require('../utils/regexData');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const AuthorizedError = require('../errors/AuthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

function login(req, res, next) {
  const { email, password } = req.body;

  if (!REGEX_PASSWORD.test(password)) throw new BadRequestError('Введён некорректный пароль');

  User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '3d' },
        );
        return res.send({ token });
      }
      throw new AuthorizedError('401: неверный e-mail или пароль');
    })
    .catch(next);
}

function createUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!REGEX_PASSWORD.test(password)) throw new BadRequestError('Введён некорректный пароль');

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => res.status(201).send({ message: 'Пользователь зарегистрирован' }))
    .catch((err) => {
      if (err.code === 11000) next(new ConflictError('Пользователь уже существует'));
      else if (err.name === 'ValidationError') next(new BadRequestError('Неккоректные данные'));
      else next(err);
    });
}

function getUserById(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь не найден'));
      }

      if (err.name === 'DocumentNotFoundError') {
        return next(new BadRequestError('id пользователя не найден'));
      }

      return next(res);
    });
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
    },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new NotFoundError('Неверный id'));
      }

      return next(err);
    });
}

module.exports = {
  updateUser,
  getUserById,
  createUser,
  login,
};
