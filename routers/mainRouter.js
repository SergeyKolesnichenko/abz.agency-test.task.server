const Router = require('express');

const tokenController = require('../controllers/tokenController');
const positionsController = require('../controllers/positionsController');
const usersController = require('../controllers/usersController')

const { body, query, param } = require('express-validator')

const upload = require('../config/multerConfig')
const optimizeMiddleware = require('../middlewares/optimizeFileMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = new Router();

router.get('/token', tokenController.createToken);

router.get('/positions', positionsController.getAllPositions);

router.post('/positions', positionsController.addPosition);

router.get('/users',

    query('page')
        .if(query('offset').not().exists())
        .notEmpty().bail()
        .withMessage('The email field is required.')
        .toInt(10)
        .custom((value, { req }) => value >= 1)
        .withMessage('The page must be at least 1.'),

    query('offset')
        .default(-1)
        .isInt()
        .withMessage('The offset must be an integer.')
        .toInt(10),

    query('count')
        .default(process.env.DEFAULT_PAGINATION_COUNT)
        .isInt()
        .withMessage('The count must be an integer.')
        .toInt(10),

    usersController.getUsers);

router.get('/users/:id',

    param('id')
        .isInt()
        .withMessage('The user_id must be an integer.')
        .toInt(10)

    ,usersController.getUserByID);

router.post('/users', authMiddleware, upload, optimizeMiddleware,

    body('name')
        .isLength({ min: 2, max: 60})
        .withMessage('The name must be at least 2 characters.'),

    body('email')
        .not().isEmpty().bail()
        .withMessage('The email field is required.')
        .matches(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f]+)\])$)/)
        .withMessage('The email must be a valid email address.'),

    body('phone')
        .not().isEmpty().bail()
        .withMessage('The phone field is required.')
        .matches(/^[\+]{0,1}380([0-9]{9})$/)
        .withMessage('The phone field is not in correct format.'),

    body('position_id')
        .not().isEmpty().bail()
        .withMessage('The position id is required.')
        .isInt().bail()
        .withMessage('The position id must be an integer.')
        .toInt(10),

    usersController.postUser);

router.post('/users/generate', authMiddleware,

    query('count')
        .isInt()
        .withMessage('The count must be an integer.')
        .toInt(10),

    usersController.generateUsers);

router.post('/positions/generate', authMiddleware,

    query('count')
        .isInt()
        .withMessage('The count must be an integer.')
        .toInt(10),

    positionsController.generatePositions);

module.exports = router;