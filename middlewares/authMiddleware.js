export const requireLogin = (req, res, next) => {
    if (req.session && req.session.usuario && req.session.rol === 'administrador') {
        next();
    } else {
        res.redirect('/login');
    }
};