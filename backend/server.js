const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const dotenv =  require('dotenv');
dotenv.config()

const subwayRouter = require('./routes/subway');
const chatRouter = require('./routes/chat');

app.get('/', (req, res) => {
    console.log('Here');
    res.send("HI");
})

app.use('/subway', subwayRouter);
app.use('/chat', chatRouter);

app.listen(3000);

