const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validAmount = catchAsync(async (req, res, next) => {
  const { userTransfer } = req;
  const { amount } = req.body;

  if (amount > userTransfer.amount) {
    return next(
      new AppError(
        'You do not have a balance to carry out this transaction',
        400
      )
    );
  }

  next();
});

exports.checkIfUsersAreTheSame = catchAsync(async (req, res, next) => {
  const { userReceiver } = req;
  const { senderUserId } = req.body;

  if (+userReceiver.id === +senderUserId) {
    return next(
      new AppError(
        'You can not transfer from your account to the same account',
        400
      )
    );
  }

  next();
});

exports.updateUsersAmount = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { userReceiver, userTransfer } = req;

  const newAmountUserSender = +userTransfer.amount - amount;
  const newAmountUserReceiver = +userReceiver.amount + amount;

  await userTransfer.update({ amount: newAmountUserSender });
  await userReceiver.update({ amount: newAmountUserReceiver });

  next();
});
