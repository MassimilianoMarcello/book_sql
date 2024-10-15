import express from 'express';
import cartControllers from '../controllers/cart.js';

const router = express.Router();

const { addToCart, removeFromCart, updateQuantity,getCartPage } = cartControllers;

// Rotte del carrello
router.post('/add', addToCart); // Add a book in the cart

router.delete('/remove/:id', removeFromCart); // remove a book from the cart
router.put('/update-quantity/:id', updateQuantity); 
router.get('/', getCartPage);
export default router;

