import express from 'express';
import bookController from '../controllers/book.js'; 
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();


router.get('/books', bookController.getAll); 
router.get('/books/:id',verifyToken, bookController.getOne);
router.post('/add-book',verifyToken,verifyAdmin, bookController.add);
router.put('/update-book/:id',verifyToken,verifyAdmin, bookController.updateBook);

router.delete('/delete-book/:id',verifyToken,verifyAdmin, bookController.remove);
router.get('/add-book',verifyToken,verifyAdmin,bookController.addBookForm)
router.get('/update-book/:id',verifyToken,verifyAdmin,bookController.updateBookForm)
export default router;