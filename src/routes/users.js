const router = require('express').Router();
const { validationUpdateProfileInfo } = require('../validation/users');
const { getUserById, updateUser } = require('../controllers/users');

router.get('/me', getUserById);
router.patch('/me', validationUpdateProfileInfo, updateUser);

module.exports = router;
