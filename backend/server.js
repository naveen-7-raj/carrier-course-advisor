const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyAf0UbkR8Zc6i61fhw6VQtX9O8YErPoxKs';  // ← Replace with your real API key

app.post('/generate-guidance', async (req, res) => {
    try {
        const response = await fetch('https://api.gemini.ai/v2.5/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: req.body.prompt,
                max_tokens: 300
            })
        });

        const json = await response.json();
        res.json({ output: json.output });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to call Gemini AI API' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:3000`));
