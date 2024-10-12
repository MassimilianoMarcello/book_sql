import express from 'express';
import bookController from '../controllers/book.js'; 

const router = express.Router();


router.get('/books', bookController.getAll); 
router.get('/books/:id', bookController.getOne);
router.post('/add-book', bookController.add);
router.put('/update-book/:id', bookController.updateBook);
router.delete('/delete-book/:id', bookController.remove);
router.get('/add-book',bookController.addBookForm)
router.get('/update-book/:id',bookController.updateBookForm)
export default router;