const express = require('express');
const router = express.Router();
const axios = require('axios');

const { OpenAI } = require('openai');

const API_KEY = process.env.API_KEY;

const openai = new OpenAI({
    apiKey: API_KEY, // This is the default and can be omitted
});

router.post('/', async (req, res) => {

    const {userMessage} = req.body;

    console.log(userMessage);

    try {
        const completion = await openai.chat.completions.create(userMessage);
        console.log(completion.choices[0].message)
        res.json(completion.choices[0].message);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);

        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.error || 'An error occurred';
            return res.status(status).json({ error: message });
        }

        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

module.exports = router;