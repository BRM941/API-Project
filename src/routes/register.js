const express = require('express');
const router = express.Router();
const {generateKey, generateSecretHash} = require('../utils/apiKey');
const {registerHash} = require('../utils/db');

router.post('/', (req, res) => {
    const apiKey = generateKey();
    const secretHash = generateSecretHash(apiKey);
    registerHash(secretHash);
    res.status(201).json({message: "This is your API key, use it by adding it to the x-api-key header for future requests. Be sure to write it down, as this will be the only time you see it.", key: apiKey});

});

module.exports = router;