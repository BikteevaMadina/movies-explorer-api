const { Joi, celebrate } = require('celebrate');
const { REGEX_EMAIL, REGEX_PASSWORD } = require('../utils/regexData');

const validationRegister = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().pattern(REGEX_PASSWORD),
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().pattern(REGEX_PASSWORD),
    email: Joi.string().required().email(),
  }),
});

const validationUpdateProfileInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(REGEX_EMAIL),
  }),
});

module.exports = {
  validationUpdateProfileInfo,
  validationRegister,
  validationLogin,
};
