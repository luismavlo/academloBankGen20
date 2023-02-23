const AppError = require('../utils/appError');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('You do not own this account.', 401));
  }

  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  if (!user) {
    return next(
      new AppError('The owner of this token it not longer available', 401)
    );
  }

  // ESTA VERIFICACIÓN SE REALIZA SI TENEMOS UN ENDPOINT PARA ACTUALIZAR CONTRASEÑA

  //   if (user.passwordChangedAt) {
  //     const changedTimeStamp = parseInt(
  //       user.passwordChangedAt.getTime() / 1000,
  //       10
  //     );

  //     if (decoded.iat < changedTimeStamp) {
  //       return next(
  //         new AppError(
  //           'User recently changed password!, please login again.',
  //           401
  //         )
  //       );
  //     }
  //   }

  req.sessionUser = user;
  next();
});

exports.validUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});

exports.validUserByIdBody = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findOne({
    where: {
      id: userId,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});

exports.validUserReceiver = catchAsync(async (req, res, next) => {
  const { accountNumber } = req.body;

  const userReceiver = await User.findOne({
    where: {
      accountNumber,
    },
  });

  if (!userReceiver) {
    return next(new AppError('User receiver not found', 404));
  }

  req.userReceiver = userReceiver;
  next();
});

exports.validUserTransfer = catchAsync(async (req, res, next) => {
  const { senderUserId } = req.body;

  const userTransfer = await User.findOne({
    where: {
      id: senderUserId,
    },
  });

  if (!userTransfer) {
    return next(new AppError('User transfers not found', 404));
  }

  req.userTransfer = userTransfer;
  next();
});
