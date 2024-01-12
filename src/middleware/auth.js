const express = require('express');
const {getHashes, getRoutes} = require('../utils/db');
const {compareKeys} = require('../utils/apiKey');

/*if (!process.env.USERNAME || !process.env.PASSWORD || !process.env.CLUSTER){
    const auth = (req, res, next) => {
        const apiKey = req.header('x-api-key');
        if (!apiKey) {
            return res.status(401).json({error: 'No API key provided'});
        }
        const hashes = getHashes((err, hashes) => {
            if (err) {
                return res.status(500).json({error: 'Error getting API key hashes from DB'});
            }
            const validHash = hashes.some(hash => compareKeys(hash, apiKey));
            if (!validHash) {
                return res.status(401).json({error: 'Invalid API key'});
            }
            const disallowedRoutes = getRoutes(validHash, (err, routes) => {
                if (err) {
                    return res.status(500).json({error: 'Error getting disallowed routes from DB'});
                }
                const route = req.originalUrl;
                if (routes.includes(route)) {
                    return res.status(403).json({error: 'Forbidden'});
                }
                else {
                    next();
                }
            });
        });
    };
    module.exports = auth;
} else{ */
    async function author(){
        return await getHashes();
        
    }

    const auth = async (req, res, next) => {
        const apiKey = req.header('x-api-key');
        if (!apiKey) {
            return res.status(401).json({error: 'No API key provided'});
        }
        const hashes = await author((err, hashes) => {
            if (err) {
                return res.status(500).json({error: 'Error getting API key hashes from DB'});
            } else{
                return hashes;
            }})

        
        const validHash = hashes.some(hash => compareKeys(hash, apiKey));

        if (!validHash) {
            return res.status(401).json({error: 'Invalid API key'});
            } else {
                next();
            }
        

        
        
    }; 
    module.exports = auth;
//}

