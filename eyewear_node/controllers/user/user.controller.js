/* global LOCALE */
const User = require("../../models/user");
const Cart = require("../../models/cart");
const bcrypt = require("bcryptjs");
const { genrateUserToken } = require("../../middlewares/auth");
const { PASSWORD } = require("../../constant/common");
const moment = require("moment");
const sendEmail = require("../../heplers/sendemail");
const _ = require("lodash");

const register = async (req, res) => {
  try {
    let { name, email, password, login_type } = req.body;
    const salt = bcrypt.genSaltSync(PASSWORD.SALT_LENGTH);
    password = bcrypt.hashSync(password.trim(), salt);

    let userExists = await User.findOne({ email: email });

    if (userExists) return helper.sendException(res, req.t("email_taken"), 200);

    const user = await User.create({
      name: name,
      email: email,
      password: password,
      login_type: +login_type,
    });

    if (!user)
      return helper.sendException(res, req.t("something_is_wrong"), 200);

    const token = await genrateUserToken({
      email: user.email,
      userId: user._id,
    });

    //adding time15 in updatedAt becasue verification otp is valid for 15 minutes
    let time15 = moment().add(15, "m").toISOString();

    let otp = helper.rand(100000, 999999);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { api_token: token, otp: otp } },
      { new: true }
    );

    //sending otp to user account
    sendEmail(user.email, "Eyewear Account Verification", "sendotp.ejs", {
      name: user.name,
      otp: otp,
    });

    return helper.sendSuccess({}, res, req.t("register_save"), 200);
  } catch (e) {
    if (e.name === "MongoError" && e.code === 11000)
      return helper.sendError({}, res, req.t("email_taken"), 200);

    return helper.sendException(res, e.message, e.code);
  }
};

const resendOtp = async (req, res) => {
  try {
    let { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user)
      return helper.sendError({}, res, req.t("email_not_register"), 200);
    else if (user.email_verified_status || user.login_type != 0) {
      return helper.sendError({}, res, req.t("account_already_verified"), 200);
    }

    let otp = helper.rand(100000, 999999);

    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { otp: otp } },
      { new: true }
    );

    //sending otp to user account
    sendEmail(user.email, "Eyewear Account Verification", "sendotp.ejs", {
      name: user.name,
      otp: otp,
    });

    return helper.sendSuccess({}, res, req.t("otp_resend"), 200);
  } catch (e) {
    return helper.sendException(res, e.message, e.code);
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email });

  let otpDate = moment.utc(user.updatedAt).tz(req.headers["timezone"]);

  let curDate = moment.utc().tz(req.headers["timezone"]);

  let diff = curDate.diff(otpDate, "minutes");

  if (user.email_verified_status == true || user.login_type != 0) {
    return helper.sendError({}, res, req.t("account_already_verified"), 200);
  }

  if (user.otp != otp) {
    return helper.sendError({}, res, req.t("invalid_otp"), 200);
  }
  //if otp older than 15 minutes user require to resend otp
  else if (diff >= 15) {
    return helper.sendError({}, res, req.t("expired_otp"), 200);
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        otp: null,
        email_verified_at: moment().toISOString(),
        email_verified_status: true,
      },
    }
  );

  return helper.sendSuccess({}, res, req.t("otp_verified"), 200);
};

const login = async (req, res) => {
  const { email, password, device_token } = req.body;

  let user = await User.findOne({ email: email, login_type: 0 });

  if (!user) {
    return helper.sendError({}, res, req.t("email_not_register"), 200);
  } else if (!bcrypt.compareSync(password, user.password)) {
    return helper.sendError({}, res, req.t("invalid_password"), 200);
  } else if (!user.email_verified_status && user.login_type == 0) {
    return helper.sendError({}, res, req.t("account_not_verified"), 201);
  }

  const token = await genrateUserToken({ email: user.email, userId: user._id });

  user = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { api_token: token, device_token: device_token } },
    { new: true }
  );

  const cartCount = await Cart.countDocuments({
    user_id: helper.ObjectId(user._id),
  });

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    login_type: user.login_type,
    api_token: user.api_token,
    role: user.role,
    cartCount: cartCount,
  };

  return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
};

const socialLogin = async (req, res) => {
  const { email, social_id, name, device_token, login_type } = req.body;

  let user = await User.findOne({ social_id: social_id });

  if (!user) {
    user = await User.create({
      name: name,
      email: email,
      login_type: +login_type,
      social_id: social_id,
      email_verified_status: true,
      email_verified_at: moment().toISOString(),
    });
  }

  const token = await genrateUserToken({ email: user.email, userId: user._id });

  user = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { api_token: token, device_token: device_token } },
    { new: true }
  );

  const cartCount = await Cart.countDocuments({
    user_id: helper.ObjectId(user._id),
  });

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    social_id: user.social_id,
    login_type: user.login_type,
    api_token: user.api_token,
    role: user.role,
    cartCount: cartCount,
  };

  return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
};

const logout = async (req, res) => {
  const { id } = req.body;
  const token = req.headers["Authorization"] || req.headers["authorization"];

  let user = await User.findOne({ api_token: token });
  if (!user) {
    return helper.sendSuccess({}, res, req.t("logout"), 200);
  }

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { api_token: null, device_token: null } },
    { new: true }
  );

  return helper.sendSuccess({}, res, req.t("logout"), 200);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email: email });

  if (!user) {
    return helper.sendError({}, res, req.t("email_not_register"), 200);
  } else if (!user.email_verified_status && user.login_type == 0) {
    return helper.sendError({}, res, req.t("account_not_verified"), 200);
  } else if (user.login_type != 0) {
    return helper.sendError({}, res, req.t("account_not_verified"), 200);
  }

  const cap = _.shuffle("QWERTYUIOPASDFGHJKLMNBVCXZ").join("").substr(0, 2);

  const sma = _.shuffle("zxcvbnmqwertyuioplkjhgfdsa").join("").substr(0, 2);

  const spe = _.shuffle("@#$%&*").join("").substr(0, 2);

  const num = _.shuffle("9051836274").join("").substr(0, 2);

  let password = _.shuffle(cap + sma + spe + num).join("");

  const salt = bcrypt.genSaltSync(PASSWORD.SALT_LENGTH);
  const hashPassword = bcrypt.hashSync(password.trim(), salt);

  user = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { password: hashPassword } },
    { new: true }
  );

  sendEmail(user.email, "Eyewear Forgot Password", "sendpassword.ejs", {
    name: user.name,
    password: password,
  });

  return helper.sendSuccess({}, res, req.t("password_sent"), 200);
};

const refreshToken = async (req, res) => {
  const { user_id } = req.body;

  let user = await User.findById(user_id);

  if (!user) {
    return helper.sendError({}, res, "Session expired. Login again", 200);
  } else if (!user.email_verified_status && user.login_type == 0) {
    return helper.sendError({}, res, req.t("account_not_verified"), 201);
  }

  const token = await genrateUserToken({ email: user.email, userId: user._id });

  user = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { api_token: token, device_token: device_token } },
    { new: true }
  );

  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    login_type: user.login_type,
    api_token: user.api_token,
    role: user.role,
  };

  return helper.sendSuccess(data, res, req.t("data_retrived"), 200);
};

module.exports = {
  register,
  resendOtp,
  verifyOtp,
  login,
  socialLogin,
  logout,
  forgotPassword,
  refreshToken,
};
