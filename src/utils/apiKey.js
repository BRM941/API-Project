const { randomBytes, scryptSync, timingSafeEqual } = require('crypto');

function generateKey(size = 32, format = 'base64') {
    const buffer = randomBytes(size);
    return "apipro_" + buffer.toString(format); // Start API key with apipro_ to make it easier to identify
}

function generateSecretHash(key) {
    const salt = randomBytes(8).toString('hex');
    const buffer = scryptSync(key, salt, 64);
    return `${buffer.toString('hex')}.${salt}`;
}

function compareKeys(storedKey, providedKey) {
    console.log(providedKey);
    const [hash, salt] = storedKey
        .slice('apipro_'.length) //Remove apipro_ from the start of the hash
        .split('.');
    const buffer = scryptSync(providedKey, salt, 64);
    return timingSafeEqual(Buffer.from(storedKey, 'hex'), buffer);
}

module.exports = {generateKey, generateSecretHash, compareKeys};