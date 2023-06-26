const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const routeSignup = require('./signup');
const routeSignin = require('./signin');
const routeMovies = require('./movies');
const routeUsers = require('./users');
const { MESSAGE_ERROR_NOT_FOUND } = require('../utils/constants');

router.use('/', routeSignin);
router.use('/', routeSignup);

router.use(auth);

router.use('/movies', routeMovies);
router.use('/users', routeUsers);
router.use((req, res, next) => next(new NotFoundError(MESSAGE_ERROR_NOT_FOUND)));

module.exports = router;
