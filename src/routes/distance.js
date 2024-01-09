const express = require('express');
const router = express.Router();

const distanceTableinMiles = {
    Mercury: {
        Mercury: 0,
        Venus: 31248757,
        Earth: 56974146,
        Mars: 105651744,
        Jupiter: 447648234,
        Saturn: 849221795,
        Uranus: 1749638696,
        Neptune: 2760936126
    },
    Venus: {
        Mercury: 31248757,
        Venus: 0,
        Earth: 25724767,
        Mars: 74402987,
        Jupiter: 416399477,
        Saturn: 817973037,
        Uranus: 1718388490,
        Neptune: 2729685920
    },
    Earth: {
        Mercury: 56974146,
        Venus: 25724767,
        Earth: 0,
        Mars: 48678219,
        Jupiter: 390674710,
        Saturn: 792248270,
        Uranus: 1692662530,
        Neptune: 2703959960
    },
    Mars: {
        Mercury: 105651744,
        Venus: 74402987,
        Earth: 48678219,
        Mars: 0,
        Jupiter: 849221795,
        Saturn: 743604524,
        Uranus: 1643982054,
        Neptune: 2655279484
    },
    Jupiter: {
        Mercury: 447648234,
        Venus: 416399477,
        Earth: 390674710,
        Mars: 849221795,
        Jupiter: 0,
        Saturn: 401592178,
        Uranus: 1301969708,
        Neptune: 2313267138
    },
    Saturn: {
        Mercury: 849221795,
        Venus: 817973037,
        Earth: 792248270,
        Mars: 743604524,
        Jupiter: 401592178,
        Saturn: 0,
        Uranus: 900377530,
        Neptune: 1911674960
    },
    Uranus: {
        Mercury: 1749638696,
        Venus: 1718388490,
        Earth: 1692662530,
        Mars: 1643982054,
        Jupiter: 1301969708,
        Saturn: 900377530,
        Uranus: 0,
        Neptune: 1011297430
    },
    Neptune: {
        Mercury: 2760936126,
        Venus: 2729685920,
        Earth: 2703959960,
        Mars: 2655279484,
        Jupiter: 2313267138,
        Saturn: 1911674960,
        Uranus: 1011297430,
        Neptune: 0
    }
}

router.get('/', (req, res) => {
    const {origin, destination} = req.query;
    if (!origin || !destination) {
        return res.status(400).json({error: 'Missing required query parameters, Example: /distance?origin=Earth&destination=Mars'});
    }
    const distance = distanceTableinMiles[origin][destination];
    res.status(200).json({distance: distance});
});

module.exports = router;