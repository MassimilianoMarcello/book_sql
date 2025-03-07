import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';





// import  createtable

import createUserTable from './models/user.js';
import createBooksTable from './models/book.js';
import createCartTable from './models/cart.js';

// import middlewares
import logger from './middleware/logger.js';

// import routes
// import flightsRoutes from './routes/flight.js';
import userRoutes from './routes/user.js';
import bookRoutes from './routes/book.js';
import cartRoutes from './routes/cart.js';
// load environment variables
dotenv.config();
const PORT = process.env.PORT || 3306;

// construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// initialize express
const app = express();

// parses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// create table
createUserTable()
createBooksTable()
createCartTable()

// use routes
app.use('/user',userRoutes)
app.use('/books',bookRoutes)
app.use('/cart',cartRoutes)

// serve static files
app.use(express.static(path.join(PATH, 'public')));

// set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(PATH, 'views'));

// use middlewares
app.use(logger);


// handle 404
app.use('*', (req, res) => {
    res.status(404).render('404', { title: '404', message: 'Page not found' });
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('404', {
        title: '500',
        message: 'Internal server error'
    });
});

// listen to port
app.listen(PORT, () => {
    console.log(`server is up and running on port :  http://localhost:${PORT}`);
});