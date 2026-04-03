import jwt from 'jsonwebtoken';

import tokenBlacklistModel from '../models/blacklistModel.js';  


async function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }   

    const isBlacklisted = await tokenBlacklistModel.findOne({ token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is invalid' });
    }

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    } catch (error) {
        
        return res.status(401).json({ message: 'Invalid token' });
    }
    next();
};

    export default authUser;
