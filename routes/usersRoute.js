const { Router } = require('express');
const usersController = require('../controllers/usersController');

const router = Router();

router.get('/', usersController.getAll);
router.get('/:username', usersController.getOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;
