const User = require("../models/user");
const Role = require("../models/role");
const bcrypt = require("bcrypt"); // for hashing password
const saltRounds = 10; // number of salt rounds
const jwt = require("jsonwebtoken");
const util = require("util");

const signToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET_STR, {
    // payload, secret string
    expiresIn: process.env.LOGIN_EXPIRE,
  });
};
const saveMemberToDB = async ({ email, first_name, last_name, created, event_id, isPaid, password }) => {
  try {
    const role = await Role.findOne({ name: "Member" });

    if (!role) {
      throw new Error("Role not found");
    }

    const encryptedPassword = await encryptPassword(password);

    const user = new User({
      email,
      first_name,
      last_name,
      created,
      password,
      isEmailVerified: true,
      isPaid,
      password: encryptedPassword, //encrypted password is added to the user object
      event_id,
      roles: [role._id], // _id is Pk
    });
    await user.save();
    console.log("user data saved in saveUserToDB method");
  } catch (error) {
    console.error("Error saving user to DB:", error);
    throw error;
  }
};

// this method is used to encrypt the password
const encryptPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error encrypting password:", error);
    return null;
  }
};

exports.signup = async (req, res) => {
  const { email, first_name, last_name, created, event_id, password } = req.body;
  try {
    await saveMemberToDB({ email, first_name, last_name, created, event_id, password });

    const userData = { email, first_name, last_name, created, event_id };

    return res.status(200).json({
      status: "success",
      message: "Member saved successfully.",
      data: userData,
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("Error saving member:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // If email or password is missing
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password." });
  }

  try {
    const existingUser = await User.findOne({ email });
    console.log("User found:", existingUser);

    if (!existingUser) {
      return res.status(200).json({
        status: "fail",
        message: "user doesn't exist. Please sign up.",
        redirectUrl: "/",
      });
    }

    const passwordMatch = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      return res.status(200).json({
        status: "fail",
        message: "Password doesn't match. Please try again.",
        redirectUrl: "/",
      });
    }

    const token = signToken(email);

    console.log("token from login: ", token);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      existingUser,
      redirectUrl: "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};

exports.protect = async (req, res, next) => {
  //1. read the token & check if it exist
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "The token doesn't exist.",
    });
  }
  try {
    //2. validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    console.log("decodedToken: ", decodedToken);

    //3. If the user exists
    const user = await User.findOne({ email: decodedToken.email });
    //await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user with the given token doesn't exist.",
      });
    }

    const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
    //4. If the user changed password after the token was issued
    if (isPasswordChanged) {
      return res.status(401).json({
        status: "fail",
        message: "The password has been changed recently. Please login again.",
      });
    }
    //5. allow user to access route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      status: "fail",
      message: "Invalid token.",
    });
  }
};

// exports.restrict = (role) => {
//   return (req, res, next)=> {
//     if(req.user.role !== role){
//       return res.status(403).json({
//         status: "fail",
//         message: "You don't have permission to perform this action",
//       });
//     }
//     next();
//   }
// };

exports.restrict = (...allowedRoles) => {
  return (req, res, next) => {
    // if (role.includes(req.user.roles)) {
    //   return res.status(403).json({
    //     status: "fail",
    //     message: "You don't have permission to perform this action",
    //   });
    // }
    const userRoles = req.user.roles; // user.roles is array of objectId
    const hasPermission = userRoles.some((role) => allowedRoles.includes(role.toString()));

    if (!hasPermission) {
      return res.status(403).json({
        status: "fail",
        message: "You don't have permission to perform this action",
      });
    }
    next();
  };
};
