const bcrypt = require('bcrypt');

async function test() {
    const password = 'password123';
    console.log('Original password:', password);

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log('Generated hash:', hash);
    console.log('Hash length:', hash.length);

    const isMatch = await bcrypt.compare(password, hash);
    console.log('Is match with correct password:', isMatch);

    const isMismatch = await bcrypt.compare('wrongpassword', hash);
    console.log('Is match with wrong password:', isMismatch);
}

test().catch(console.error);
