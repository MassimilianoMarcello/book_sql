import express from 'express';
import bookController from '../controllers/book.js'; 
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();


router.get('/books', bookController.getAll); 
router.get('/books/:id',verifyToken, bookController.getOne);
router.post('/add-book',verifyToken, bookController.add);
router.put('/update-book/:id',verifyToken, bookController.updateBook);

router.delete('/delete-book/:id',verifyToken, bookController.remove);
router.get('/add-book',verifyToken,bookController.addBookForm)
router.get('/update-book/:id',verifyToken,bookController.updateBookForm)
export default router;