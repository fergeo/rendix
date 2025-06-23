import jwt from 'jsonwebtoken';

const SECRET_KEY = 'R3nd1X/0fge';

export const requireLogin = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
};
