const express = require('express');
const app = express();
app.use(express.json());

const subwayRouter = require('./routes/subway');

app.get('/', (req, res) => {
    console.log('Here');
    res.send("HI");
})

app.use('/subway', subwayRouter);

app.listen(3000);
