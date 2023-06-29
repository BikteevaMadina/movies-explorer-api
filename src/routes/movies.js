const router = require('express').Router();
const { createMoviesValidation, deleteMoviesValidation } = require('../validation/movies');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.delete('/:id', deleteMoviesValidation, deleteMovie);
router.post('/', createMoviesValidation, createMovie);
router.get('/', getMovies);

module.exports = router;
