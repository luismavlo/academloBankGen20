const { Router } = require('express');
const {
  registerUser,
  loginUser,
  findHistory,
  renewToken,
  closeAccount,
} = require('../controllers/user.controller');
const {
  protect,
  protectAccountOwner,
  validUser,
} = require('../middlewares/user.middleware');
const {
  createUserValidations,
  loginUserValidation,
  validateFields,
} = require('../middlewares/validations.middleware');

const router = Router();

router.post('/signup', createUserValidations, validateFields, registerUser);

router.post('/login', loginUserValidation, validateFields, loginUser);

router.use(protect);

router.get('/:id/history', validUser, protectAccountOwner, findHistory);

router.get('/renew', renewToken);

router.patch(
  '/close/account/:id',
  loginUserValidation,
  validateFields,
  validUser,
  protectAccountOwner,
  closeAccount
);

module.exports = {
  userRouter: router,
};
