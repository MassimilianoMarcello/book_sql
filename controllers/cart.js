import query from '../config/db.js';

const cartControllers = {
    // Aggiungi un libro al carrello
    addToCart: async (req, res) => {
        try {
            const userId = req.cookies.userId; // make sure to have the id user
            const bookId = req.body.bookId; 
            const quantity = parseInt(req.body.quantity, 10); 
    
            // Aggiungi il logging per il debug
            console.log('User ID:', userId);
            console.log('Book ID:', bookId);
            console.log('Quantity:', quantity); 
    
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
    
            // Ceck if the element is already in the shopping cart
            const strQuery = `SELECT * FROM cart WHERE user_id = ? AND book_id = ?`;
            const params = [userId, bookId];
            const existingItem = await query(strQuery, params);
    
            if (existingItem.length > 0) {
                // If the element already exist change the quantity
                const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?`;
                await query(updateQuery, [quantity, userId, bookId]);
            } else {
                // Add a new wlwmwnt in the cart whit the price
                const insertQuery = `INSERT INTO cart (user_id, book_id, quantity, price) VALUES (?, ?, ?, ?)`;
                await query(insertQuery, [userId, bookId, quantity, price]);
            }
    
            res.status(201).redirect('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error); 
            res.status(500).send('Internal Server Error');
        }
    },
    
    
    
    

    getCartPage: async (req, res) => {
        try {
            const userId = req.cookies.userId; // Take the Id from cookies
            const strQuery = `SELECT * FROM cart WHERE user_id = ?`; 
            const params = [userId];
            const cartItems = await query(strQuery, params);
            const token = req.cookies.token;
            const role = req.cookies.role;
       // debugging logs
       console.log('Token:', req.cookies.token); // Log del token
       console.log('Role:', req.user?.role); // Log del ruolo
            // Query for having book details
            const bookDetailsQuery = `
                SELECT c.*, b.name, b.price 
                FROM cart c
                JOIN books b ON c.book_id = b.id 
                WHERE c.user_id = ?`; 
            const bookDetails = await query(bookDetailsQuery, params);
    
            res.status(200).render('layout', {
                title: 'Your Shopping Cart',
                body: 'includes/cart/cartPage', 
                token,
                role,
                cartItems: bookDetails, 
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    

    // Remove a book from the cart
    removeFromCart: async (req, res) => {
        try {
            const { id } = req.params; // shopping cart id
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

    // Update quantity in the cart
    updateQuantity: async (req, res) => {
        console.log('Update quantity controller hit'); // check if the controller is called
        const { id } = req.params; // ID of the product in the cart
        const { quantity } = req.body; // Take the quantity from the form
        console.log('Updating quantity for item ID:', id);
        console.log('New quantity:', quantity); // ceck quantity
    
        try {
            const parsedQuantity = parseInt(quantity, 10);
            if (isNaN(parsedQuantity) || parsedQuantity < 1) {
                console.log('Invalid quantity:', quantity); // error log
                return res.status(400).send('Invalid quantity');
            }
    
            // Aggiorna la quantità nel database
            const sqlQuery = 'UPDATE cart SET quantity = ? WHERE id = ?';
            const params = [parsedQuantity, id];
            console.log('Executing query:', sqlQuery, 'Params:', params); // log of the query
            const result = await query(sqlQuery, params);
    
            if (result.affectedRows > 0) {
                console.log('Quantity updated successfully'); // Log Success
                return res.status(200).redirect('/cart');
            } else {
                console.log('Item not found in cart'); // Log error
                return res.status(404).send('Item not found in cart');
            }
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            return res.status(500).send('Internal Server Error');
        }
    },
    
    
};

export default cartControllers;
