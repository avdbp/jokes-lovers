const express = require('express');
const axios = require('axios');
const router = express.Router();


router.get('/chiste-random', (req, res, next) => {
   
    res.render("jokes/chiste-random");
  
  });

// const dotenv = require('dotenv');
// dotenv.config();
// const apiKey = process.env.APIKEY_AI_SECRET;

// router.get('/chiste-random', (req, res, next) => {
//     const prompt = "Genera un chiste en español.";

//     axios.post('https://api.openai.com/v1/chat/completions', {
//         prompt: prompt,
//         max_tokens: 50,
//     }, {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         }
//     })
//     .then(response => {
//         const chiste = response.data.choices[0].text.trim();
//         res.render('/jokes/chiste-random', { chiste }); 
//     })
//     .catch(error => {
//         console.error(error);
//         res.status(500).json({ error: 'Error al generar el chiste.' });
//     });
// });

module.exports = router;
