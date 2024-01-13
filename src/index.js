require("dotenv").config()
const express = require('express');
const path = require('path');
const rateLimitMiddleware = require('./middleware/rateLimit');
const registerRoutes = require('./routes/register');
const reynoldnumb = require('./routes/reynolds');
const auth = require('./middleware/auth');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(rateLimitMiddleware);

app.use('/register', registerRoutes); // Register route is not protected by auth middleware
//app.use(auth);

app.use('/reynolds', auth)
app.use('/reynolds', reynoldnumb);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT);