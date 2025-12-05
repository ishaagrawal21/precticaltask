const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production', {
    expiresIn: '7d',
  });
};

// REGISTER USER
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: 'Name, email, and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).send({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    const token = generateToken(user._id);

    return res.status(200).send({
      message: 'User registered successfully',
      result: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// LOGIN USER
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    return res.status(200).send({
      message: 'Login successful',
      result: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
};
