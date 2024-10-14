import express from 'express';
import cartControllers from '../controllers/cart.js';

const router = express.Router();

const { addToCart, removeFromCart, updateQuantity,getCartPage } = cartControllers;

// Rotte del carrello
router.post('/add', addToCart); // Aggiungi un libro al carrello

router.delete('/remove/:id', removeFromCart); // Rimuovi un libro dal carrello
router.put('/update/:id', updateQuantity); // Aggiorna la quantità di un libro nel carrello
router.get('/', getCartPage);
export default router;

