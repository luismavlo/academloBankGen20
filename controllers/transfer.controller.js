const Transfer = require('../models/transfer.model');
const catchAsync = require('../utils/catchAsync');

exports.createTransfer = catchAsync(async (req, res, next) => {
  const { amount, senderUserId } = req.body;
  const { userReceiver } = req;

  await Transfer.create({
    amount,
    senderUserId,
    receiverUserId: userReceiver.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Transfer successfully',
  });
});

exports.uploadAmount = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { user } = req;

  await user.update({
    amount: +user.amount + Number(amount),
  });

  res.status(200).json({
    status: 'success',
    message: `You have made a consignment to your account for the amount of $${amount}`,
  });
});
