const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'administrator') {
        next(); // L'utente è un amministratore, prosegui
    } else {
        return res.status(403).render('404', {
            title: 'Access Denied',
            message: 'Access denied: for administrators only'
        });
    }
};

export default checkAdmin
