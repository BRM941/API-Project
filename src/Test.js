const crypto = require('crypto');

// Function to generate a random API key of size 32 using base64
function generateRandomApiKey() {
  const apiKey = crypto.randomBytes(24).toString('base64');
  return apiKey;
}

// Function to add salt to the buffer
function addSaltToBuffer(buffer) {
  const salt = crypto.randomBytes(8);
  const saltedBuffer = Buffer.concat([buffer, salt]);
  return { saltedBuffer, salt };
}

// Function to undo the salt and check equality
function undoSaltAndCheckEquality(originalBuffer) {
  const unsaltedBuffer = originalBuffer.slice(0, originalBuffer.length - salt.length);
  console.log(unsaltedBuffer.toString('base64'));
  return unsaltedBuffer.toString('base64');
}

// Generate random API key
const apiKey = generateRandomApiKey();
console.log('Original API Key:', apiKey);

// Convert API key to buffer
const apiKeyBuffer = Buffer.from(apiKey, 'base64');

// Add salt to the buffer
const { saltedBuffer, salt } = addSaltToBuffer(apiKeyBuffer);
console.log('Salted Buffer:', saltedBuffer.toString('base64'));

// Undo the salt and check equality
const Equal = undoSaltAndCheckEquality(saltedBuffer);
console.log(apiKey)
const isEqual = Equal === apiKey;
console.log('Are original and unsalted buffers equal?', isEqual);

