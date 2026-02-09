const db = require('./config/db');
require('dotenv').config();

async function cleanup() {
    try {
        console.log('--- Database Maintenance: Resetting Transactional Data ---');

        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        console.log('Clearing all bookings...');
        await db.query('TRUNCATE TABLE booking_seats');
        await db.query('TRUNCATE TABLE bookings');

        console.log('Clearing all reviews...');
        await db.query('TRUNCATE TABLE reviews');

        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('SUCCESS: Admin Dashboard data has been reset.');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

cleanup();
