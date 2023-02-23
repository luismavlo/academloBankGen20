const { Router } = require('express');
const {
  createTransfer,
  uploadAmount,
} = require('../controllers/transfer.controller');
const {
  validAmount,
  checkIfUsersAreTheSame,
  updateUsersAmount,
} = require('../middlewares/transfer.middleware');
const {
  protect,
  validUserByIdBody,
  validUserReceiver,
  validUserTransfer,
} = require('../middlewares/user.middleware');
const {
  validateFields,
  createTransferValidation,
  uploadAmountValidation,
} = require('../middlewares/validations.middleware');

const router = Router();

router.use(protect);

router.post(
  '/',
  createTransferValidation,
  validateFields,
  validUserReceiver,
  validUserTransfer,
  validAmount,
  checkIfUsersAreTheSame,
  updateUsersAmount,
  createTransfer
);

router.post(
  '/upload',
  uploadAmountValidation,
  validateFields,
  validUserByIdBody,
  uploadAmount
);

module.exports = {
  transferRouter: router,
};
