const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  MESSAGE_ERROR_INCORRECT_DATA,
  MESSAGE_ERROR_INCORRECT_ID,
  MESSAGE_DELETED_FILM,
  MESSAGE_ADD_FILM,
  MESSAGE_ERROR_FILM_NOT_FOUND,
} = require('../utils/constants');

const Movie = require('../models/movie');

function getMovies(req, res, next) {
  const { _id } = req.user;

  Movie
    .find({ owner: _id })
    .populate('owner', '_id')
    .then((movies) => {
      if (movies) return res.send(movies);
      throw new NotFoundError(MESSAGE_ERROR_FILM_NOT_FOUND);
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(MESSAGE_ERROR_INCORRECT_ID));
      else next(err);
    });
}

function createMovie(req, res, next) {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie
    .create({ // ведётся запись данных в базу
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      nameRU,
      nameEN,
      owner: _id,
      movieId,
    })
    .then(() => res.status(201).send({ message: MESSAGE_ADD_FILM }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(MESSAGE_ERROR_INCORRECT_DATA));
      else next(err);
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError(MESSAGE_ERROR_FILM_NOT_FOUND);

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) throw new ForbiddenError(MESSAGE_ERROR_INCORRECT_ID);

      movie.deleteOne()
        .then(() => res.send({ message: MESSAGE_DELETED_FILM }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
