const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
    try {
        console.log('Fetching all movies...');
        const [movies] = await db.query('SELECT * FROM movies ORDER BY release_date DESC');
        console.log(`Found ${movies.length} movies.`);
        res.json(movies);
    } catch (err) {
        console.error('Error fetching movies:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [movies] = await db.query('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        if (movies.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(movies[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id/schedules', async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.start_time, s.price, t.name as theater_name, t.total_rows, t.seats_per_row
            FROM schedules s
            JOIN theaters t ON s.theater_id = t.id
            WHERE s.movie_id = ?
            ORDER BY s.start_time ASC
        `;
        const [schedules] = await db.query(query, [req.params.id]);
        res.json(schedules);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
