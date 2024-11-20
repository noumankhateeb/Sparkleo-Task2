const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

app.use(cors()); // Use the cors middleware

app.use(bodyParser.json());

app.use('/auth', authRoutes);

app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'You have accessed a protected route!', user: req.user });
});

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error connecting to the database:', err);
});
