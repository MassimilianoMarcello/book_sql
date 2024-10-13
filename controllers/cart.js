import query from '../config/db.js';

const cartControllers = {
    // Aggiungi un libro al carrello
    addToCart: async (req, res) => {
        try {
            const { userId, bookId, quantity } = req.body;

            if (!userId || !bookId || !quantity) {
                return res.status(400).send('User ID, Book ID, and Quantity are required');
            }

            // Controlla se il libro è già presente nel carrello
            const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND book_id = ?`;
            const checkParams = [userId, bookId];
            const checkResult = await query(checkQuery, checkParams);

            if (checkResult.length > 0) {
                // Aggiorna la quantità se il libro è già nel carrello
                const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?`;
                const updateParams = [quantity, userId, bookId];
                await query(updateQuery, updateParams);
                return res.status(200).send('Book quantity updated in the cart');
            }

            // Altrimenti, aggiungi il libro al carrello
            const sqlQuery = `INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)`;
            const result = await query(sqlQuery, [userId, bookId, quantity]);
            res.status(201).send('Book added to cart successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Ottieni il carrello dell'utente
    // cart.js (controllers/cart.js)



    getCart: async (req, res) => {
        const { userId } = req.params; // Ottieni l'ID dell'utente dai parametri

        try {
            const strQuery = `SELECT * FROM cart WHERE user_id = ?`; // Assumendo che cart abbia una colonna user_id
            const params = [userId];
            const cartItems = await query(strQuery, params);

            res.status(200).render('layout', {
                title: 'Your Cart',
                body: 'includes/cart/cartView', // Assicurati che questa vista esista
                cartItems
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },





    // Rimuovi un libro dal carrello
    removeFromCart: async (req, res) => {
        try {
            const { id } = req.params;
            const strQuery = `DELETE FROM cart WHERE id = ?`;
            const params = [id];
            await query(strQuery, params);

            res.status(200).send('Book removed from cart successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Aggiorna la quantità di un libro nel carrello
    updateQuantity: async (req, res) => {
        try {
            const { id } = req.params;
            const { quantity } = req.body;

            if (!quantity) {
                return res.status(400).send('Quantity is required');
            }

            const sqlQuery = `UPDATE cart SET quantity = ? WHERE id = ?`;
            await query(sqlQuery, [quantity, id]);

            res.status(200).send('Book quantity updated successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
};

export default cartControllers;
