const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

const isAdminOrCreator = async (req, res, next) => {
  try {
    const Event = require('../model/EventModel');
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user.role === 'admin' || event.createdBy.toString() === req.user._id.toString()) {
      req.event = event;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. You can only manage your own events or be an admin.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrCreator,
};
