const router = require('express').Router();
const { validationLogin } = require('../validation/users');
const { login } = require('../controllers/users');

router.post('/signin', validationLogin, login);

module.exports = router;
