import express from 'express';
import controllers from '../controllers/user.js';


const router = express.Router();

const {getLoginForm,getRegistrationForm, add, getAll,getOne,update,remove } =
    controllers;

// routes
router.get('/get', getAll);
router.get('/get/:id', getOne);
router.post('/register', add);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);
router.get('/register', getRegistrationForm);
router.post('/register', add);
router.get('/login', getLoginForm);

export default router;
