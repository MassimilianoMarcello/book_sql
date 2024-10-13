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
    
            // Controlla se l'elemento è già nel carrello
            const strQuery = `SELECT * FROM cart WHERE user_id = ? AND book_id = ?`;
            const params = [userId, bookId];
            const existingItem = await query(strQuery, params);
    
            if (existingItem.length > 0) {
                // L'elemento esiste già, aggiorna la quantità
                const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?`;
                await query(updateQuery, [quantity, userId, bookId]);
            } else {
                // Aggiungi un nuovo elemento al carrello
                const insertQuery = `INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)`;
                await query(insertQuery, [userId, bookId, quantity]);
            }
    
            res.status(201).send('Book added to cart');
        } catch (error) {
            console.error('Error adding to cart:', error); // Aggiungi un messaggio di errore
            res.status(500).send('Internal Server Error');
        }
    },
    
    

    getCartPage: async (req, res) => {
        try {
            const userId = req.cookies.userId; // Ottieni l'ID dell'utente dai cookie
            const strQuery = `SELECT * FROM cart WHERE userId = ?`;
            const params = [userId];
            const cartItems = await query(strQuery, params);
    
            // Puoi anche ottenere i dettagli dei libri unendo la tabella dei libri
            // Esempio di query con join (opzionale)
            const bookDetailsQuery = `
                SELECT c.*, b.name, b.price 
                FROM cart c
                JOIN books b ON c.bookId = b.id
                WHERE c.userId = ?`;
            const bookDetails = await query(bookDetailsQuery, params);
    
            res.status(200).render('layout', {
                title: 'Your Shopping Cart',
                body: 'includes/cart/cartPage', // Assicurati di avere una vista per la pagina del carrello
                cartItems: bookDetails, // Passa i dettagli del carrello alla vista
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

            res.status(200).send('Book removed from cart successfully');
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
