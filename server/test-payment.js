const axios = require('axios');

// CONFIGURATION
const SERVER_URL = 'http://localhost:5000/api/payment/notification';
const BOOKING_ID = process.argv[2]; 

if (!BOOKING_ID) {
    console.error('Usage: node test-payment.js <BOOKING_ID>');
    process.exit(1);
}

const mockNotification = {
    transaction_status: 'settlement',
    order_id: `BOOKING-${BOOKING_ID}-MOCK`, 
    gross_amount: '10000',
    fraud_status: 'accept',
    transaction_id: 'mock-transaction-123'
};

async function simulateWebhook() {
    try {
        console.log(`Simulating payment confirmation for Booking #${BOOKING_ID}...`);
        const response = await axios.post(SERVER_URL, mockNotification);
        console.log('Server response:', response.data);
        console.log('SUCCESS: The booking status should now be updated in your database.');
    } catch (err) {
        console.error('FAILED: Could not send mock notification.');
        console.error(err.response?.data || err.message);
    }
}

simulateWebhook();
