const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Resgister a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {};

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {};

// @desct Get user profile
// @route GET /api/auth/profile
// @access Private (Requires JWT)
const getUserProfile = async (req, res) => {};

// desc Update user profile
// @route PUT /api/auth/update
// @access Private (Requires JWT)
const updateUserProfile = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
