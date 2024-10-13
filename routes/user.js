import express from 'express';
import controllers from '../controllers/user.js';


const router = express.Router();

const {getLoginForm,getRegistrationForm, loginUser, addUserRegistration, getAll,getOne,update,remove } =
    controllers;

// routes
router.get('/get', getAll);
router.get('/get/:id', getOne);
router.post('/register', addUserRegistration);
router.put('/update/:id', update);
router.delete('/delete/:id', remove);
router.get('/register', getRegistrationForm);
router.post('/login', loginUser);
router.get('/login', getLoginForm);

export default router;
