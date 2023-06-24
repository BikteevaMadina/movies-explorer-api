const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const Movie = require('../models/movie');

function getMovies(req, res, next) {
  const { _id } = req.user;

  Movie
    .find({ owner: _id })
    .populate('owner', '_id')
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
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
    .then(() => res.status(201).send({ message: 'Фильм добавлен' }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Неверные данные'));
      else next(err);
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) throw new NotFoundError('Данные не найдены');

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) throw new ForbiddenError('Нельзя удалить фильм другого пользователя');

      movie.deleteOne()
        .then(() => res.send({ message: 'Фильм удалён' }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
