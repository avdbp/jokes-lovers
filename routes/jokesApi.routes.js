const express = require('express');
const axios = require('axios');
const router = express.Router();

const dotenv = require('dotenv');
dotenv.config();
const apiKey = process.env.APIKEY_AI_SECRET;

router.get('/chiste-random', (req, res, next) => {
    const prompt = "Genera un chiste en español.";

    console.log('apikey', apiKey);

    axios.post('https://api.openai.com/v1/completions', {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 50,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => {
        const chiste = response.data.choices[0].text.trim();
        res.render('jokes/chiste-random', { chiste: chiste }); // Aquí debes pasar el chiste con la clave 'chiste'
    })
    .catch(error => {
        console.error(error.response.data);
        res.status(500).json({ error: 'Error al generar el chiste.' });
    });
});

module.exports = router;

