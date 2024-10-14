import query from '../config/db.js';

const cartControllers = {
    // Aggiungi un libro al carrello
    addToCart: async (req, res) => {
        try {
            const userId = req.cookies.userId; // Assicurati di avere l'ID dell'utente
            const bookId = req.body.bookId; // Assicurati che bookId venga passato correttamente
            const quantity = parseInt(req.body.quantity, 10); // Ottieni la quantità dal body e converti in numero
    
            // Aggiungi il logging per il debug
            console.log('User ID:', userId);
            console.log('Book ID:', bookId);
            console.log('Quantity:', quantity); // Aggiungi un log per la quantità
    
            if (!userId || !bookId || isNaN(quantity) || quantity < 1) {
                return res.status(400).send('User ID, Book ID and valid Quantity are required');
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
            const role = req.cookies.role;
       // Aggiungi i log qui
       console.log('Token:', req.cookies.token); // Log del token
       console.log('Role:', req.user?.role); // Log del ruolo
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
                role,
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
        console.log('Update quantity controller hit'); // Verifica se il controller è chiamato
        const { id } = req.params; // ID del prodotto nel carrello
        const { quantity } = req.body; // Quantità dal form
        console.log('Updating quantity for item ID:', id);
        console.log('New quantity:', quantity); // Questo dovrebbe mostrare il valore della quantità
    
        try {
            const parsedQuantity = parseInt(quantity, 10);
            if (isNaN(parsedQuantity) || parsedQuantity < 1) {
                console.log('Invalid quantity:', quantity); // Log di errore
                return res.status(400).send('Invalid quantity');
            }
    
            // Aggiorna la quantità nel database
            const sqlQuery = 'UPDATE cart SET quantity = ? WHERE id = ?';
            const params = [parsedQuantity, id];
            console.log('Executing query:', sqlQuery, 'Params:', params); // Log della query
            const result = await query(sqlQuery, params);
    
            if (result.affectedRows > 0) {
                console.log('Quantity updated successfully'); // Log di successo
                return res.status(200).redirect('/cart');
            } else {
                console.log('Item not found in cart'); // Log di errore
                return res.status(404).send('Item not found in cart');
            }
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            return res.status(500).send('Internal Server Error');
        }
    },
    
    
};

export default cartControllers;
