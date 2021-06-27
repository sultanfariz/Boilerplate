const { Router } = require('express');
const Auth = require('../controllers/auth');

const router = Router();

router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);

module.exports = router;
