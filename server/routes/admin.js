const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to verify admin role
const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const bearer = token.split(' ')[1];
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access only' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Get Dashboard Stats
router.get('/stats', isAdmin, async (req, res) => {
    try {
        const [totalBookings] = await db.query('SELECT COUNT(*) as count FROM bookings');
        const [totalRevenue] = await db.query('SELECT SUM(total_price) as sum FROM bookings WHERE status = "confirmed"');
        const [pendingCount] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"');
        const [confirmedCount] = await db.query('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"');

        res.json({
            totalBookings: totalBookings[0].count,
            totalRevenue: totalRevenue[0].sum || 0,
            pendingCount: pendingCount[0].count,
            confirmedCount: confirmedCount[0].count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Bookings
router.get('/bookings', isAdmin, async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, u.name as user_name, u.email as user_email, u.avatar_url as user_avatar, m.title as movie_title, s.start_time, t.name as theater_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN schedules s ON b.schedule_id = s.id
            JOIN movies m ON s.movie_id = m.id
            JOIN theaters t ON s.theater_id = t.id
            ORDER BY b.created_at DESC
        `);

        for (let booking of bookings) {
            const [seats] = await db.query('SELECT seat_row, seat_number FROM booking_seats WHERE booking_id = ?', [booking.id]);
            booking.seats = seats;
        }

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
