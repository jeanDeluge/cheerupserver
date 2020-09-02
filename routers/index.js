const router = require('express').Router()
const userController = require('../Controller/userController');
const user = require('./auth/user')

router.use('/user', user )
router.use('/user', userController.check)

module.exports = router