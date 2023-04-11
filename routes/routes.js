var express = require("express")
var app = express();
var router = express.Router();
var UserController = require('../controllers/UserController');
const auth = require('../middlewares/auth');

// users
router.post('/user', UserController.create);
router.get('/user', auth, UserController.index);
router.get('/user/:id', auth, UserController.findUser);
router.put('/user', auth, UserController.edit);
router.delete('/user/:id', auth, UserController.remove);

// password recover/update
router.post('/recover', UserController.recoverPassword);
router.put('/changepassword', UserController.changePassword);

// login (jwt)
router.post('/login', UserController.login);

module.exports = router;