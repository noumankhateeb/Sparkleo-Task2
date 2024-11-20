const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token.' });
    }
};
