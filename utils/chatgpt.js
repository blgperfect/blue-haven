const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Votre clé API OpenAI
});

async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Modèle à utiliser
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Erreur avec OpenAI API :", error);
        return "Désolé, une erreur est survenue. Veuillez réessayer plus tard.";
    }
}

module.exports = { getChatGPTResponse };
