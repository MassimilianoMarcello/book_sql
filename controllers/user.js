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
        const role = req.cookies.role; // Recupera il ruolo dai cookie
        res.status(200).render('layout', {
            title: 'Enter email and password',
            body: 'includes/user/loginForm',
            token,
            role
        });
    },

    // Render registration form
    getRegistrationForm: (req, res) => {
        const token = req.cookies.token;
        const role = req.cookies.role; // Taek the role of the cookie
        res.status(200).render('layout', {
            title: 'Register with email and password',
            body: 'includes/user/userRegistrationForm',
            token,
            role
        });
    },

    // Fill the registration form
    addUserRegistration: async (req, res) => {
        const { email, password, repassword, isAdmin } = req.body;
        const adminRole = isAdmin ? true : false; // set admin true if present

        console.log('Password:', password);
        console.log('Repassword:', repassword);
        console.log('Is Admin:', adminRole);

        try {
            const sqlCheckUser = 'SELECT * FROM users WHERE email = ?';
            const paramsCheckUser = [email];
            const userExists = await query(sqlCheckUser, paramsCheckUser);

            if (userExists.length > 0) {
                return res.status(200).send('User already exists');
            }

            // Validate email, password and repassword
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const samePassword = matchPassword(password, repassword);
            // debug
            console.log('isValidEmail:', isValidEmail);
            console.log('isValidPassword:', isValidPassword);
            console.log('samePassword:', samePassword);

            if (isValidEmail && isValidPassword && samePassword) {
                const hashedPassword = hashPassword(password);
                const role = adminRole ? 'administrator' : 'user'; // determines the role

                const sqlInsertUser =
                    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
                const paramsInsertUser = [email, hashedPassword, role]; // add a role
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

        // Verify if the email exist in the database
        const sqlStr = 'SELECT * FROM users WHERE email = ?';
        const params = [email];

        try {
            const result = await query(sqlStr, params);

           // If we don't find the user, we return an error
            if (result.length === 0) {
                return res.status(400).render('login', {
                    title: 'Login',
                    message: 'Invalid email or password'
                });
            }

           // Get the user data
            const user = result[0];
            const role = user.role;
        // Compare the entered password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).render('404', {
                    title: 'Login',
                    message: 'Invalid email or password'
                });
            }

            // Create  token JWT for user
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role }, // Add roles here
                process.env.TOKEN_SECRET,
                {
                    expiresIn: '1h' // token espires after 1 h
                }
            );

         // Set the token as a cookie
            res.cookie('token', token, { httpOnly: true });

            // set ruolo as a cookie
            res.cookie('role', user.role, {
                httpOnly: true, // not accesible with JavaScript
                secure: process.env.NODE_ENV === 'production', // True in prodution
                maxAge: 24 * 60 * 60 * 1000 // Cookie duration 1 day
            });

            // set user'ID as a e cookie
            res.cookie('userId', user.id, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                maxAge: 24 * 60 * 60 * 1000 
            });

            
            return res.status(200).redirect('/books/books');
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).render('500', {
                title: 'Server Error',
                message: 'Something went wrong. Please try again later.'
            });
        }
    },

    logoutUser: async (req, res) => {
        res.clearCookie('token');
        res.clearCookie('role'); 
        res.status(302).redirect('/user/login');
    },

    getAll: async (req, res) => {
        const token = req.cookies.token;
        const role = req.cookies.role; 
        // Retrieve the role from cookies
        try {
            const strQuery = `SELECT * FROM users`;
            const result = await query(strQuery);
            res.status(200).render('layout', {
                title: 'My goals',
                body: 'includes/user/allUsers',
                token,
                role,
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
            const { id } = req.params; // user id from URL
            const { email, password } = req.body; 

            // verifica if there is a password and if is hashed
            let hashedPassword;
            if (password) {
                hashedPassword =  hashPassword(password); 
            }

            // Costruisci la query dinamicamente
            const sqlQuery = `UPDATE users SET email = ?${password ? ', password = ?' : ''} WHERE id = ?`;
            const params = [email];
            if (hashedPassword) params.push(hashedPassword); 
            params.push(id); // add  user id if not present

            const result = await query(sqlQuery, params); 

            console.log(result);
            res.status(200).send('User updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    remove: async (req, res) => {
        try {
            const { id } = req.params; 
            const strQuery = `DELETE FROM users WHERE id=?`; // Query SQL to delete user
            const params = [id]; // parameter for the query
            const result = await query(strQuery, params); // run the query

           
            res.status(200).redirect('/user/get'); 
            console.log(result); 
        } catch (error) {
            console.error(error); 
            res.status(500).send('Internal Server Error'); 
        }
    }
};

export default userControllers;
