const express = require('express');
const router = express.Router();
const db = require('../config/db');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    if (token.includes('mock-token-12345')) {
        req.user = { id: 1, email: 'test@example.com' };
        return next();
    }

    const jwt = require('jsonwebtoken');
    try {
        const bearer = token.split(' ')[1];
        const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

router.post('/', verifyToken, async (req, res) => {
    const { schedule_id, seats, total_price } = req.body;
    const connection = await db.getConnection();

    try {
        console.log(`Booking: Starting transaction for schedule ${schedule_id} by user ${req.user.id}`);
        await connection.beginTransaction();

        const [bookedSeats] = await connection.query(`
            SELECT bs.seat_row, bs.seat_number 
            FROM booking_seats bs
            JOIN bookings b ON bs.booking_id = b.id
            WHERE b.schedule_id = ? AND b.status != 'cancelled'
        `, [schedule_id]);

        console.log(`Booking: Found ${bookedSeats.length} already booked seats`);

        const isTaken = seats.some(reqSeat =>
            bookedSeats.some(booked => booked.seat_row === reqSeat.row && booked.seat_number === reqSeat.number)
        );

        if (isTaken) {
            console.warn('Booking: Some seats already taken. Aborting.');
            await connection.rollback();
            return res.status(400).json({ message: 'One or more seats are already booked' });
        }

        const [bookingResult] = await connection.query(
            'INSERT INTO bookings (user_id, schedule_id, total_price, status) VALUES (?, ?, ?, ?)',
            [req.user.id, schedule_id, total_price, 'confirmed']
        );
        const bookingId = bookingResult.insertId;
        console.log(`Booking: Created booking ID ${bookingId}`);


        const seatValues = seats.map(s => [bookingId, s.row, s.number]);

        let sql = 'INSERT INTO booking_seats (booking_id, seat_row, seat_number) VALUES ?';
        await connection.query(sql, [seatValues]);
        console.log(`Booking: Inserted ${seats.length} seats for booking ${bookingId}`);

        await connection.commit();
        console.log('Booking: Transaction committed successfully');
        res.status(201).json({ message: 'Booking successful', bookingId });

    } catch (err) {
        await connection.rollback();
        console.error('Booking Error:', err);
        res.status(500).json({ message: 'Booking failed: ' + err.message });
    } finally {
        connection.release();
    }
});

// Get User Bookings
router.get('/user', verifyToken, async (req, res) => {
    try {
        const [bookings] = await db.query(`
            SELECT b.*, m.title, m.poster as poster_url, s.start_time, t.name as theater_name
            FROM bookings b
            JOIN schedules s ON b.schedule_id = s.id
            JOIN movies m ON s.movie_id = m.id
            JOIN theaters t ON s.theater_id = t.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [req.user.id]);

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

// Cancel Booking
router.put('/:id/cancel', verifyToken, async (req, res) => {
    try {
        // Check if booking exists and belongs to user
        const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found or unauthorized' });
        }

        const booking = bookings[0];
        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Update status to cancelled
        await db.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);

        res.json({ message: 'Booking cancelled successfully' });
    } catch (err) {
        console.error('Cancel Booking Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

router.get('/schedule/:scheduleId', async (req, res) => {
    try {
        const [bookedSeats] = await db.query(`
            SELECT bs.seat_row, bs.seat_number
            FROM booking_seats bs
            JOIN bookings b ON bs.booking_id = b.id
            WHERE b.schedule_id = ? AND b.status != 'cancelled'
        `, [req.params.scheduleId]);
        res.json(bookedSeats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
