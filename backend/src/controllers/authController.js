const jwt = require("jsonwebtoken");
const { User } = require("../models");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" },
  );
};

const validateRegisterInput = ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password || !confirmPassword) {
    return "All fields are required";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
};

const registerWithRole = async (req, res, roleToAssign) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const validationError = validateRegisterInput({
      name,
      email,
      password,
      confirmPassword,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: roleToAssign,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: `${capitalize(roleToAssign)} registered successfully`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.register = (req, res) => registerWithRole(req, res, "user");

exports.adminRegister = (req, res) => registerWithRole(req, res, "admin");

exports.userRegister = (req, res) => registerWithRole(req, res, "user");

const loginWithRoleCheck = async (req, res, requiredRole = null) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (requiredRole && user.role !== requiredRole) {
      return res.status(403).json({
        message: `${capitalize(requiredRole)} access required. Your account does not have the required privileges.`,
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    const roleDisplay = requiredRole ? capitalize(requiredRole) : "User";
    res.status(200).json({
      message: `${roleDisplay} login successful`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = (req, res) => loginWithRoleCheck(req, res);

exports.adminLogin = (req, res) => loginWithRoleCheck(req, res, "admin");

exports.userLogin = (req, res) => loginWithRoleCheck(req, res, "user");
