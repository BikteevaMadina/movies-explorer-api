const { Joi, celebrate } = require('celebrate');
const { REGEX_URL } = require('../utils/regexData');

const createMoviesValidation = celebrate({
  body: Joi.object().keys({
    thumbnail: Joi.string().required().pattern(REGEX_URL),
    trailer: Joi.string().required().pattern(REGEX_URL),
    image: Joi.string().required().pattern(REGEX_URL),
    description: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    year: Joi.string().required(),
  }),
});

const deleteMoviesValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  createMoviesValidation,
  deleteMoviesValidation,
};
