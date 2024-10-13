import express from 'express';
import cartControllers from '../controllers/cart.js';

const router = express.Router();

const { addToCart, getCart, removeFromCart, updateQuantity } = cartControllers;

// Rotte del carrello
router.post('/add', addToCart); // Aggiungi un libro al carrello

// router.get('/user/:userId', getCart); 
// Ottieni il carrello dell'utente


router.get('/:userId', getCart);
router.delete('/remove/:id', removeFromCart); // Rimuovi un libro dal carrello
router.put('/update/:id', updateQuantity); // Aggiorna la quantità di un libro nel carrello

export default router;
