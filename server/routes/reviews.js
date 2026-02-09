const express = require('express');
const router = express.Router();
const db = require('../config/db');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
};

// GET all reviews (SOAL 4: Data Dinamis)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT r.*, u.name as user_name, u.avatar_url as user_avatar, m.title as movie_title
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            JOIN movies m ON r.movie_id = m.id
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await db.query(query);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/movie/:movieId', async (req, res) => {
    try {
        const query = `
            SELECT r.*, u.name as user_name, u.avatar_url as user_avatar 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.movie_id = ? 
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await db.query(query, [req.params.movieId]);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { movie_id, rating, comment } = req.body;

    if (!movie_id || !rating || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES (?, ?, ?, ?)',
            [req.user.id, movie_id, rating, comment]
        );

        const [newReview] = await db.query(
            `SELECT r.*, u.name as user_name, u.avatar_url as user_avatar, m.title as movie_title 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             JOIN movies m ON r.movie_id = m.id 
             WHERE r.id = ?`,
            [result.insertId]
        );

        res.status(201).json(newReview[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);

        if (review.length === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to delete this review' });
        }

        await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
