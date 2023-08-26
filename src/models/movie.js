const mongoose = require('mongoose');
const validator = require('validator');

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
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку',
      },
      required: [true, 'Поле обязательно к заполнению.'],
    },

    trailer: {
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку',
      },
      required: [true, 'Поле обязательно к заполнению.'],
    },
    thumbnail: {
      type: String,
      validate: {
        validator(v) {
          return validator.isURL(v, {
            require_protocol: true,
            require_valid_protocol: true,
            require_host: true,
          });
        },
        message: 'Введите корректную ссылку',
      },
      required: [true, 'Поле обязательно к заполнению.'],
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
