// config/db.js
import mysql from 'mysql2/promise';  // Usa la versione promise di mysql2
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup per dotenv
const __filename = fileURLToPath(import.meta.url);
const PATH = path.dirname(__filename);
dotenv.config({
    path: path.join(PATH, '..', '.env')  // Carica il file .env
});

// Crea il pool di connessione
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql-database.render.com',  // Usa l'hostname fornito da Render
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '1qasw23edfr45tg',
    database: process.env.DB_NAME || 'massidatabase_test',
    port: process.env.DB_PORT || 3306,  // Usa la porta di default MySQL
    connectionLimit: 10  // Limite di connessioni simultanee
});

console.log('MySQL connection pool created');

// Funzione query per eseguire SQL
const query = async (sql, params) => {
    const connection = await pool.getConnection();
    console.log('Query received:', sql, params);  // Log della query
    try {
        const [results] = await connection.query(sql, params);
        console.log('Query results:', results);  // Log dei risultati
        return results;
    } catch (err) {
        console.error('Query error:', err);  // Log degli errori
        return err;
    } finally {
        connection.release();  // Rilascia la connessione
        console.log('Connection released');
    }
};

export default query;





















// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// // construct path
// const __filename = fileURLToPath(import.meta.url);
// const PATH = dirname(__filename);

// // load environment variables
// dotenv.config({
//     path: path.join(PATH, '..', '.env')
// });

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     connectionLimit: 10
// });

// console.log('mysql connection pool created');

// // Create query function
// const query = async (sql, params) => {
//     const connection = await pool.getConnection();
//     console.log('Query received:', sql, params);  // Log della query e dei parametri
//     try {
//         const [results] = await connection.query(sql, params);
//         console.log('Query results:', results);  // Log dei risultati
//         return results;
//     } catch (err) {
//         console.error('Query error:', err);  // Log degli errori
//         return err;
//     } finally {
//         if (connection) {
//             connection.release();
//             console.log('Connection released');
//         }
//     }
// };


// export default query;
