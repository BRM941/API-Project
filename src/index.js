require("dotenv").config()
const express = require('express');
const path = require('path');
const rateLimitMiddleware = require('./middleware/rateLimit');
const registerRoutes = require('./routes/register');
const distanceRoutes = require('./routes/distance');
const auth = require('./middleware/auth');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimitMiddleware);

app.use('/register', registerRoutes); // Register route is not protected by auth middleware
//app.use(auth);

app.use('/distance', auth)
app.use('/distance', distanceRoutes);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((req, res, next) => {
    res.status(500).send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);