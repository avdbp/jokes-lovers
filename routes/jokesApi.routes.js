const express = require('express');
const axios = require('axios');
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const dotenv = require('dotenv');
dotenv.config();
const apiKey = process.env.APIKEY_AI_SECRET;

router.get('/chiste-random', isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser 
    const prompt = "Genera un chistes en español de los más populares y graciosos que encuentres.";

    console.log('apikey', apiKey);

    axios.post('https://api.openai.com/v1/completions', {
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 4000,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    })
    .then(response => {
        const chiste = response.data.choices[0].text.trim();
        res.render('jokes/chiste-random', { chiste: chiste, user: currentUser }); // Aquí debes pasar el chiste con la clave 'chiste'
    })
    .catch(error => {
        console.error(error.response.data);
        res.status(500).json({ error: 'Error al generar el chiste.' });
    });
});

module.exports = router;

