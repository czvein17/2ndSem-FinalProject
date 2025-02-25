const User = require("../models/User");
const APIFeatures = require("../utils/apiFeatures");
const ErrorResponse = require("../utils/ErrorResponse");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email: email }).select("+password");
  return user;
};

const findAllUsers = async (req) => {
  console.log(req.query);

  totalCount = await User.countDocuments();

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  console.log(totalCount);

  const users = await features.query;
  return { totalCount, users };
};

const findUserByGoogleId = async (googleId) => {
  const user = await User.findOne({ googleId: googleId }).select("+password");
  return user;
};

const findUserByFacebookId = async (facebookId) => {
  const user = await User.findOne({ facebookId: facebookId }).select(
    "+password"
  );
  return user;
};

const findUserById = async (id) => {
  const user = await User.findById(id).select("+password");
  return user;
};

const createUser = async (payload) => {
  const email = payload.email;

  let user = await findUserByEmail(email);
  if (user) throw new ErrorResponse(400, "User already exists");

  user = await User.create({
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    fullname: `${payload.firstName} ${payload.middleName} ${payload.lastName}`,
    email: payload?.email,
    password: payload?.password,
  });

  return user;
};

const createUserViaGoogle = async (payload) => {
  const user = await User.create({
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    fullname: payload.fullName,
    email: payload.email,
    googleId: payload.googleId,
    googleProfilePic: payload.googleProfilePic,
  });

  return user;
};

const createUserViaFacebook = async (payload) => {
  const user = await User.create({
    firstName: payload.firstName,
    middleName: payload.middleName,
    lastName: payload.lastName,
    email: payload.email,
    facebookId: payload.facebookId,
  });

  return user;
};

module.exports = {
  findUserByEmail,
  findAllUsers,
  findUserByGoogleId,
  findUserByFacebookId,
  findUserById,
  createUser,
  createUserViaGoogle,
  createUserViaFacebook,
};
