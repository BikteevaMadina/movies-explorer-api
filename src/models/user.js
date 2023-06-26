const { compare } = require('bcryptjs');
const mongoose = require('mongoose');
const { REGEX_EMAIL } = require('../utils/regexData');
const AuthorizedError = require('../errors/AuthorizedError');
const { MESSAGE_INCORRECT_MAIL_PASSWORD } = require('../utils/constants');

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
      validate: {
        validator: ({ length }) => length >= 2 && length <= 30,
        message: 'Длина имени пользователя от 2 до 30 символов',
      },
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      validate: {
        validator: (email) => REGEX_EMAIL.test(email),
        message: 'Введите e-mail',
      },
    },
  },

  {
    statics: {
      findUserByCredentials(email, password) {
        return (
          this.findOne({ email })
            .select('+password')
        )
          .then((user) => {
            if (user) {
              return compare(password, user.password)
                .then((matched) => {
                  if (matched) return user;
                  return Promise.reject(new AuthorizedError(MESSAGE_INCORRECT_MAIL_PASSWORD));
                });
            }
            return Promise.reject(new AuthorizedError(MESSAGE_INCORRECT_MAIL_PASSWORD));
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
