import query from '../config/db.js';

// create a new cart table
const createCartTable = async () => {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS cart (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL,  
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            )
        `;
      
        const result = await query(sql);
        console.log(result);  // Log the result of the table creation
    } catch (error) {
        console.error(error);  // Log any errors that occur
    }
};

export default createCartTable;

