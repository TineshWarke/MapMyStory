const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const StoryRouter = require('./Routes/StoryRouter');

require('dotenv').config;
require('./Models/dbConnect');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors());
app.use('https://map-my-story-server.vercel.app/auth', AuthRouter);
app.use('https://map-my-story-server.vercel.app/story', StoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})