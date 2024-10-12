import query from '../config/db.js';

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
    getAll: async (req, res) => {
        try {
            const strQuery = `SELECT * FROM users`;
            const result = await query(strQuery);
            res.status(200).render('layout', {
                title: 'My goals',
                body: 'includes/user/allUsers',
                users:result,
           
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
    add: async (req, res) => {
        try {
           
            // Take parameters from the body of the request
            const { email, password } = req.body;
    
           
            // Verify that the field are full: there is a password and a mail
            if (!email || !password) {
                return res.status(400).send('Email and password are required');
            }
    
            // The query SQL for insert email e password
            const sqlQuery = `INSERT INTO users (email, password) VALUES (?, ?)`;
    
      
              // Esecute the query with the dinamic params
            const result = await query(sqlQuery, [email, password]);
    
            // Respond wuth the query result
            res.status(200).redirect('/user/get'); 
        } catch (error) {
            console.error(error); 
            res.status(500).send('Internal Server Error'); 
        }
    },
    
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const sqlQuery = `Update users set email=? ,password=? where id=?`;
            const params = ['stupidmail@gmail.com', '1qa2ws3ed4rf5tg', id];
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
            const { id } = req.params;  // Ottieni l'ID dell'utente dall'URL
            const strQuery = `DELETE FROM users WHERE id=?`;  // Query SQL per eliminare l'utente
            const params = [id];  // Parametri per la query
            const result = await query(strQuery, params);  // Esegui la query
    
            // Redirect alla pagina della lista utenti dopo l'eliminazione
            res.status(200).redirect('/user/get');  // Modifica il percorso in base alle tue necessità
            console.log(result);  // Log del risultato per il debug
        } catch (error) {
            console.error(error);  // Log dell'errore
            res.status(500).send('Internal Server Error');  // Risposta in caso di errore
        }
    }
    
};

export default userControllers;