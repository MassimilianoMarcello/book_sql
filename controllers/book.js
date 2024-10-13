import query from '../config/db.js';

const bookControllers = {
    // Get all  books
    getAll: async (req, res) => {
        try {
            const strQuery = `SELECT * FROM books`;
            const books = await query(strQuery);
          // const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Select one of our amazing  Books',
            body: 'includes/book/bookList',
           books
            // token
        });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },

    // Get a book from ID
    // Get a book from ID
getOne: async (req, res) => {
    try {
        const { id } = req.params;
        const strQuery = `SELECT * FROM books WHERE id=?`;
        const params = [id];
        const result = await query(strQuery, params);
        const book = result[0];
        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Passa l'ID dell'utente qui, se disponibile
        const userId = req.cookies.userId; // Assicurati di avere l'ID dell'utente salvato nei cookie

        res.status(200).render('layout', {
            title: 'Select one of our amazing Books',
            body: 'includes/book/bookDetails',
            book,
            userId // Aggiungi l'ID dell'utente qui
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
},

    // add book form
    addBookForm: (req, res) => {
        // const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Add a new Book',
            body: 'includes/book/addBookForm',
            // token
        });
    },
    // Add a book
    add: async (req, res) => {
        try {
            const { name, year, author, price, image_url, description } = req.body;
    
            // Validazione semplice
            if (!name || !year || !author || isNaN(price) || !description) {
                return res.status(400).send('All fields are required and price must be a number');
            }
    
            const sqlQuery = `INSERT INTO books (name, year, author, price, image_url, description) VALUES (?, ?, ?, ?, ?, ?)`;
            const params = [name, parseInt(year), author, parseFloat(price), image_url || null, description]; // Assicurati di includere description
            const result = await query(sqlQuery, params);
    
            res.status(201).redirect(`/books/books`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    // add book form
    updateBookForm: async (req, res) => {
        try {
            const { id } = req.params;
            const strQuery = `SELECT * FROM books WHERE id = ?`;
            const params = [id];
            const book = await query(strQuery, params);
    
            if (book.length === 0) {
                return res.status(404).send('Book not found');
            }
    
            res.status(200).render('layout', {
                title: 'Update Book',
                body: 'includes/book/updateBookForm',
                book: book[0]  // Passa il singolo libro alla vista
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    },
    

    // update an existing flight
    updateBook: async (req, res) => {
  
        try {
            const { id } = req.params;
            const { name, year, author, price, description, image_url } = req.body;
    
            // Validazione semplice
            if (!name || !year || !author || isNaN(price) || !description) {
                return res.status(400).send('All fields are required and price must be a number');
            }
    
            const sqlQuery = `UPDATE books SET name=?, year=?, author=?, price=?, description=?, image_url=? WHERE id=?`;
            const params = [name, year, author, parseFloat(price), description, image_url, id];
            
            const result = await query(sqlQuery, params);
    
            if (result.affectedRows === 0) {
                console.log('No rows affected, book not found');
                return res.status(404).send('Book not found');
            }
            
    
            // Reindirizza alla pagina dei dettagli del libro aggiornato
            res.status(200).redirect(`/books/books`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    

    // Delete from ID
    remove: async (req, res) => {
        try {
            const { id } = req.params;
            const strQuery = `DELETE FROM books WHERE id=?`;
            const params = [id];
            const result = await query(strQuery, params);

            if (result.affectedRows === 0) {
                return res.status(404).send('Book not found');
            }

            res.status(200).redirect(`/books/books`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};

export default bookControllers;