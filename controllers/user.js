import query from '../config/db.js';
import hashPassword from '../utils/hashPassword.js';
import validateEmail from '../utils/validateEmail.js';
import matchPassword from '../utils/matchPasswords.js';
import validatePassword from '../utils/validatePassword.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userControllers = {
    getLoginForm: (req, res) => {
        const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Enter email and password ',
            body: 'includes/user/loginForm',
            token
        });
    },
    // Render registration form
    getRegistrationForm: (req, res) => {
        const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Register with email and password ',
            body: 'includes/user/userRegistrationForm',
            token
        });
    },
    // fill the registration form
    addUserRegistration: async (req, res) => {
        const { email, password, repassword } = req.body;
        console.log('Password:', password);
        console.log('Repassword:', repassword);

        try {
            const sqlCheckUser = 'SELECT * FROM users WHERE email = ?';
            const paramsCheckUser = [email];
            const userExists = await query(sqlCheckUser, paramsCheckUser);

            if (userExists.length > 0) {
                return res.status(200).send('User already exists');
            }

            // Valida email, password e corrispondenza password
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const samePassword = matchPassword(password, repassword);

            console.log('isValidEmail:', isValidEmail); // Debug
            console.log('isValidPassword:', isValidPassword); // Debug
            console.log('samePassword:', samePassword); // Debug

            if (isValidEmail && isValidPassword && samePassword) {
                const hashedPassword = hashPassword(password);
                const sqlInsertUser =
                    'INSERT INTO users (email, password) VALUES (?, ?)';
                const paramsInsertUser = [email, hashedPassword];
                const result = await query(sqlInsertUser, paramsInsertUser);

                if (result.affectedRows > 0) {
                    return res.status(201).redirect('/user/login');
                } else {
                    return res.status(400).render('404', {
                        title: 'Error',
                        message: 'Failed to register user'
                    });
                }
            } else {
                return res.status(400).render('404', {
                    title: 'Error',
                    message: 'Invalid email or password'
                });
            }
        } catch (error) {
            console.error('Error during user registration:', error);
            return res.status(500).render('500', {
                title: 'Server Error',
                message: 'Something went wrong. Please try again later.'
            });
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;

        // Verifica se l'email esiste nel database
        const sqlStr = 'SELECT * FROM users WHERE email = ?';
        const params = [email];
        
        try {
            const result = await query(sqlStr, params);
    
            // Se non troviamo l'utente, restituiamo un errore
            if (result.length === 0) {
                return res.status(400).render('login', {
                    title: 'Login',
                    message: 'Invalid email or password'
                });
            }
    
            // Recupera i dati dell'utente
            const user = result[0];
    
            // Confronta la password inserita con quella hashata nel database
            const isMatch = await bcrypt.compare(password, user.password);
    
            if (!isMatch) {
                return res.status(400).render('404', {
                    title: 'Login',
                    message: 'Invalid email or password'
                });
            }
    
            // Crea un token JWT per l'utente
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: '1h' // Il token scadrà dopo 1 ora
                }
            );
    
            // Imposta il token come cookie (puoi anche inviarlo come header se preferisci)
            res.cookie('token', token, { httpOnly: true });
    
            // Imposta l'ID dell'utente come cookie
            res.cookie('userId', user.id, {
                httpOnly: true, // Non accessibile tramite JavaScript
                secure: process.env.NODE_ENV === 'production', // True in produzione
                maxAge: 24 * 60 * 60 * 1000 // Durata del cookie: 1 giorno
            });
    
            // Reindirizza l'utente alla home o a una dashboard
            return res.status(200).redirect('/books/books');
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).render('500', {
                title: 'Server Error',
                message: 'Something went wrong. Please try again later.'
            });}},
        
    logoutUser: async (req, res) => {
        res.clearCookie('token');

        res.status(302).redirect('/user/login');
    },

    getAll: async (req, res) => {
        const token = req.cookies.token;
        try {
            const strQuery = `SELECT * FROM users`;
            const result = await query(strQuery);
            res.status(200).render('layout', {
                title: 'My goals',
                body: 'includes/user/allUsers',
                token,
                users: result
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('internal server error');
        }
    },
    getOne: async (req, res) => {
        try {
            const { id } = req.params;
            const strQuery = `SELECT * FROM users WHERE id=?`;
            const params = [id];
            const result = await query(strQuery, params);
            res.status(200).send(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('internal server error');
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params; // Ottieni l'ID dell'utente dall'URL
            const { email, password } = req.body; // Estrai email e password dal corpo della richiesta
    
            // Verifica se la password è stata fornita e hashala
            let hashedPassword;
            if (password) {
                hashedPassword = await hashPassword(password); // Assicurati di importare la tua funzione hashPassword
            }
    
            // Costruisci la query dinamicamente
            const sqlQuery = `UPDATE users SET email = ?${password ? ', password = ?' : ''} WHERE id = ?`;
            const params = [email];
            if (hashedPassword) params.push(hashedPassword); // Aggiungi la password hashata se presente
            params.push(id); // Aggiungi l'ID dell'utente
    
            const result = await query(sqlQuery, params); // Esegui la query
    
            console.log(result);
            res.status(200).send('User updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    remove: async (req, res) => {
        try {
            const { id } = req.params; // Ottieni l'ID dell'utente dall'URL
            const strQuery = `DELETE FROM users WHERE id=?`; // Query SQL per eliminare l'utente
            const params = [id]; // Parametri per la query
            const result = await query(strQuery, params); // Esegui la query

            // Redirect alla pagina della lista utenti dopo l'eliminazione
            res.status(200).redirect('/user/get'); // Modifica il percorso in base alle tue necessità
            console.log(result); // Log del risultato per il debug
        } catch (error) {
            console.error(error); // Log dell'errore
            res.status(500).send('Internal Server Error'); // Risposta in caso di errore
        }
    }
};

export default userControllers;
