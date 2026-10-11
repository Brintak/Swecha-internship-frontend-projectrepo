const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Session = require('../models/Session');
const Task = require('../models/Task');
const User = require('../models/User');
const { hashToken } = require('../middleware/authenticate');

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const createSession = async (user) => {
  const token = crypto.randomBytes(32).toString('base64url');
  await Session.create({
    user: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
  });
  return token;
};

const validateCredentials = ({ name, email, password }, requireName = false) => {
  if (requireName && (!name || !name.trim())) return 'Please provide your name.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return 'Please provide a valid email address.';
  }
  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    return 'Password must be between 6 and 72 characters.';
  }
  return null;
};

const getSetupStatus = async (req, res, next) => {
  try {
    const hasUsers = await User.exists({});
    res.status(200).json({
      success: true,
      needsBootstrap: false,
      hasUsers: Boolean(hasUsers),
      bootstrapConfigured: true,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const validationError = validateCredentials(req.body, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const email = req.body.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const isFirstUser = !(await User.exists({}));

    const user = await User.create({
      name: req.body.name.trim(),
      email,
      passwordHash: await bcrypt.hash(req.body.password, 12),
    });

    // If this is the first user, migrate any previously unassigned tasks to them
    if (isFirstUser) {
      await Task.updateMany(
        { $or: [{ owner: { $exists: false } }, { owner: null }] },
        { $set: { owner: user._id } }
      );
    }

    const token = await createSession(user);
    res.status(201).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

// bootstrapOwner forwards to register so existing clients succeed seamlessly
const bootstrapOwner = async (req, res, next) => {
  return register(req, res, next);
};

const login = async (req, res, next) => {
  try {
    const validationError = validateCredentials(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Email or password is incorrect.' });
    }

    const token = await createSession(user);
    res.status(200).json({ success: true, token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = (req, res) => {
  res.status(200).json({ success: true, user: publicUser(req.user) });
};

const logout = async (req, res, next) => {
  try {
    if (req.authSession?._id) {
      await Session.deleteOne({ _id: req.authSession._id });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSetupStatus, bootstrapOwner, register, login, getCurrentUser, logout };