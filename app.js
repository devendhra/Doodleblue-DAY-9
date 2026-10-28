require('dotenv').config();
const connectDB = require('./config/db');
const express = require("express");
const userRoutes = require('./routes/user.route');

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello World' });
});

app.use('/api/users', userRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }); 
}).catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});





