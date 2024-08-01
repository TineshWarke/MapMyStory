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
app.use(cors({
    origin: "https://map-my-story.vercel.app"
}));

app.use(cors());

app.options('*', cors());

app.use('/auth', AuthRouter);
app.use('/story', StoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
})