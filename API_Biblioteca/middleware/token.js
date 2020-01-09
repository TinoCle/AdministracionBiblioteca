const config = require('../config/config');
const express = require('express');
const jwt = require('jsonwebtoken');

const secureRoute = express.Router();
secureRoute.use((req, res, next) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, config.key, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(404).send({
            message: 'No token provided.'
        });
    }
});

module.exports = {
    secureRoute
}