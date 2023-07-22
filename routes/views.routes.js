const express = require('express');
const axios = require('axios');
const router = express.Router();

// Configura tu clave de API de GPT-3
const apiKey = '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';

router.get('/chiste', (req, res) => {
    const prompt = "Genera un chiste en español.";

    axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
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
        res.json({ chiste });
    })
    .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el chiste.' });
    });
});

module.exports = router;
