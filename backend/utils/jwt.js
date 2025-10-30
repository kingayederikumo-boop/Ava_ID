const jwt = require('jsonwebtoken');

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function verify(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok: false, error: 'No auth' });
  const token = auth.replace('Bearer ', '');
  try {
    const data = verify(token);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }
}

module.exports = { sign, verify, authMiddleware };
