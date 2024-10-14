import query from '../config/db.js';

const cartControllers = {
    // Aggiungi un libro al carrello
    addToCart: async (req, res) => {
        try {
            const userId = req.cookies.userId; // Assicurati di avere l'ID dell'utente
            const bookId = req.body.bookId; // Assicurati che bookId venga passato correttamente
            const quantity = 1; // O il valore che desideri
    
            // Aggiungi il logging per il debug
            console.log('User ID:', userId);
            console.log('Book ID:', bookId);
    
            if (!userId || !bookId) {
                return res.status(400).send('User ID and Book ID are required');
            }
    
            // Recupera il prezzo del libro
            const getBookQuery = 'SELECT price FROM books WHERE id = ?';
            const bookResult = await query(getBookQuery, [bookId]);
    
            if (bookResult.length === 0) {
                return res.status(404).send('Book not found');
            }
    
            const price = bookResult[0].price;
    
            // Controlla se l'elemento è già nel carrello
            const strQuery = `SELECT * FROM cart WHERE user_id = ? AND book_id = ?`;
            const params = [userId, bookId];
            const existingItem = await query(strQuery, params);
    
            if (existingItem.length > 0) {
                // L'elemento esiste già, aggiorna la quantità
                const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?`;
                await query(updateQuery, [quantity, userId, bookId]);
            } else {
                // Aggiungi un nuovo elemento al carrello con il prezzo
                const insertQuery = `INSERT INTO cart (user_id, book_id, quantity, price) VALUES (?, ?, ?, ?)`;
                await query(insertQuery, [userId, bookId, quantity, price]);
            }
    
            res.status(201).redirect('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error); // Aggiungi un messaggio di errore
            res.status(500).send('Internal Server Error');
        }
    },
    
    
    

    getCartPage: async (req, res) => {
        try {
            const userId = req.cookies.userId; // Ottieni l'ID dell'utente dai cookie
            const strQuery = `SELECT * FROM cart WHERE user_id = ?`; // Cambia userId in user_id
            const params = [userId];
            const cartItems = await query(strQuery, params);
            const token = req.cookies.token;
    
            // Query per ottenere i dettagli dei libri
            const bookDetailsQuery = `
                SELECT c.*, b.name, b.price 
                FROM cart c
                JOIN books b ON c.book_id = b.id 
                WHERE c.user_id = ?`; // Cambia userId in user_id
            const bookDetails = await query(bookDetailsQuery, params);
    
            res.status(200).render('layout', {
                title: 'Your Shopping Cart',
                body: 'includes/cart/cartPage', // Assicurati di avere una vista per la pagina del carrello
                token,
                cartItems: bookDetails, 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    

    // Rimuovi un libro dal carrello
    removeFromCart: async (req, res) => {
        try {
            const { id } = req.params; // id del carrello
            const strQuery = `DELETE FROM cart WHERE id = ?`;
            const params = [id];
            const result = await query(strQuery, params);

            if (result.affectedRows === 0) {
                return res.status(404).send('Cart item not found');
            }
            res.status(200).redirect('/cart');
           
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Aggiorna la quantità di un libro nel carrello
    updateQuantity: async (req, res) => {
        try {
            const { id } = req.params; // id del carrello
            const { quantity } = req.body;

            const strQuery = `UPDATE cart SET quantity = ? WHERE id = ?`;
            const params = [quantity, id];
            const result = await query(strQuery, params);

            if (result.affectedRows === 0) {
                return res.status(404).send('Cart item not found');
            }

            res.status(200).send('Cart item updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};

export default cartControllers;
