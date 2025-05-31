export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }

        return res.redirect('/login');
    });
};
