export const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
