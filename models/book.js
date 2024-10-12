import query from '../config/db.js';

// create a new flights table
const createBookTable = async () => {
    try {
        const sql = ` 
            CREATE TABLE IF NOT EXISTS books (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                year INT NOT NULL,
                author  VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                image_url VARCHAR(255),
                 description VARCHAR(500),
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
export default createBookTable;