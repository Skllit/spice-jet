// backend/controllers/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn:'7d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message:'Email in use' });
  user = await User.create({ name, email, password });
  res.status(201).json({ 
    token: signToken(user._id),
    user: { id:user._id, name:user.name, email:user.email, role:user.role }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message:'Invalid creds' });
  res.json({
    token: signToken(user._id),
    user: { id:user._id, name:user.name, email:user.email, role:user.role }
  });
};
