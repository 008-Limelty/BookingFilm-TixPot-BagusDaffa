const db = require('./config/db');

async function checkUsers() {
    try {
        const [users] = await db.query('SELECT id, name, email FROM users');
        console.log('Current users in database:');
        console.table(users);
        process.exit(0);
    } catch (err) {
        console.error('Error checking users:', err);
        process.exit(1);
    }
}

checkUsers();
