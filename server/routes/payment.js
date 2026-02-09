const express = require('express');
const router = express.Router();
const db = require('../config/db');
const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

router.post('/notification', async (req, res) => {
    try {
        const statusResponse = await snap.transaction.notification(req.body);
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

        const bookingId = orderId.split('-')[1];

        if (transactionStatus == 'capture') {
            if (fraudStatus == 'challenge') {
                await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['pending', bookingId]);
            } else if (fraudStatus == 'accept') {
                await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['confirmed', bookingId]);
            }
        } else if (transactionStatus == 'settlement') {
            await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['confirmed', bookingId]);
        } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
            await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
        } else if (transactionStatus == 'pending') {
            await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['pending', bookingId]);
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('Midtrans Notification Error:', err);
        res.status(500).send('Error');
    }
});

module.exports = router;
