import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const { token } = req.cookies; // Recupera il token dai cookie
    if (!token) {
        return res.status(401).render('404', {
            title: 'Unauthorized',
            message: 'You are not authorized to access this page'
        });
    }
    
    // Verifica il token
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
        if (err) {
            return res.status(403).render('404', {
                title: 'Forbidden',
                message: 'You are forbidden from accessing this page'
            });
        }
        
        // Salva i dati decodificati nel req.user
        req.user = data; 
        next(); 
    });
};

export default verifyToken;
