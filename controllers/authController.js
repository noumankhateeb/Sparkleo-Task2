const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Sign-up controller
exports.signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Checking for existing user');
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Creating new user');
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error in signup controller:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Finding user by email');
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        console.log('Comparing password');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        console.log('Generating JWT');
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Error in login controller:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
