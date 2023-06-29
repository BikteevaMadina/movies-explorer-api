const router = require('express').Router();
const { validationRegister } = require('../validation/users');
const { createUser } = require('../controllers/users');

router.post('/signup', validationRegister, createUser);

module.exports = router;
