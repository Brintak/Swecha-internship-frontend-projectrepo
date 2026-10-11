const crypto = require('crypto');
const Session = require('../models/Session');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.get('Authorization') || '';
    const token = authorization.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length).trim()
      : '';

    if (!token) {
      return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
    }

    const session = await Session.findOne({
      tokenHash: hashToken(token),
      expiresAt: { $gt: new Date() },
    }).populate('user');

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
    }

    req.user = session.user;
    req.authSession = session;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate, hashToken };