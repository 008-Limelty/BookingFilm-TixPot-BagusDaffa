const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Auth: Attempting registration for email ${email}`);
    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.warn(`Auth: Registration failed - Email ${email} already exists`);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Auth: Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Auth: Inserting user into database...');
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, avatar_url) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, req.body.avatar_url || null]
        );

        console.log(`Auth: User registered successfully with ID ${result.insertId}`);
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        console.error('Auth Registration Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', async (req, res) => {
    const { name, email, avatar_url } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const [existing] = await db.query('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        await db.query(
            'UPDATE users SET name = ?, email = ?, avatar_url = ? WHERE id = ?',
            [name, email, avatar_url, userId]
        );

        const [updatedUser] = await db.query('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [userId]);

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser[0]
        });
    } catch (err) {
        console.error('Profile Update Error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
});

module.exports = router;
