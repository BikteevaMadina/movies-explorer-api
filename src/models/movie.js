const mongoose = require('mongoose');
const { URL_REGEX } = require('../utils/regexData');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const movieSchema = new Schema(
  {
    country: {
      required: true,
      type: String,
    },
    director: {
      required: true,
      type: String,
    },
    duration: {
      required: true,
      type: Number,
    },
    year: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Введите URL-адрес',
      },
    },

    trailer: {
      required: true,
      type: String,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Введите URL-адрес',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REGEX.test(url),
        message: 'Введите URL-адрес',
      },
    },
    nameRU: {
      required: true,
      type: String,
    },
    nameEN: {
      required: true,
      type: String,
    },
    owner: {
      required: true,
      type: ObjectId,
      ref: 'user',
    },
    movieId: {
      required: true,
      type: Number,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
