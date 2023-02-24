const User = require('../models/user.model');
const accountNumberGenerator = require('../utils/accountNumberGenerator');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const Transfer = require('../models/transfer.model');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  const accountNumber = accountNumberGenerator();

  const salt = await bcrypt.genSalt(10);
  const secretPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    password: secretPassword,
    accountNumber,
  });

  const token = await generateJWT(user.id);

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      uid: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { accountNumber, password } = req.body;

  const user = await User.findOne({
    where: {
      accountNumber,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  return res.json({
    status: 'success',
    message: 'Welcome to the academlo bank',
    token,
    user: {
      uid: user.id,
      name: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.renewToken = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const token = await generateJWT(id);

  const user = await User.findOne({
    where: {
      status: true,
      id,
    },
  });

  return res.status(200).json({
    status: 'success',
    token,
    user: {
      uid: user.id,
      user: user.name,
      accountNumber: user.accountNumber,
      amount: user.amount,
    },
  });
});

exports.findHistory = catchAsync(async (req, res, next) => {
  const { user } = req;

  const transfer = await Transfer.findAll({
    where: {
      senderUserId: user.id,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'user history has been successfully found',
    transfer,
  });
});

exports.closeAccount = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { accountNumber, password } = req.body;

  if (user.accountNumber !== accountNumber) {
    return next(
      new AppError(`the account number does not match the user's`, 400)
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'the account has been successfully deactivated',
  });
});
