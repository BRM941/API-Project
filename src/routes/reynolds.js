const express = require('express');
const router = express.Router();

function reynumber(den, vel, dia, visc){
    re = (den * vel * dia) / (visc);
    return re.toExponential(2);
}


router.get('/', (req, res) => {
    const den = req.header('den');
    const vel = req.header('vel');
    const dia = req.header('dia');
    const visc = req.header('visc');
    
    const checkArray = [den, vel, dia, visc];

    
    checkArray.forEach(variable => {
        if (variable < 0){
            return res.status(400).json({error: `Variables cannot be negative.`});
            
        }

        if (isNaN(variable)){
            return res.status(400).json({error: `Variables must be a number.`});
            
        }

        switch(typeof variable){
            case 'undefined':
                return res.status(400).json({error: `Missing at least one variable in header.`});
                
            default:
                break

        }
    })

    const reynolds = reynumber(den, vel, dia, visc);
    res.status(200).json({"Reynold's Number": reynolds});
});

module.exports = router;