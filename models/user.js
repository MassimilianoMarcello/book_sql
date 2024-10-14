import query from '../config/db.js';

// create a new user table

const createUserTable = async () => {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                  role VARCHAR(20) NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        // Assuming 'query' is your function to execute SQL queries
        const result = await query(sql);
        console.log(result);  // Log the result of the table creation
    } catch (error) {
        console.error(error);  // Log any errors that occur
    }
};
export default createUserTable