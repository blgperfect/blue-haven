const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getChatGPTResponse(messages) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error("Erreur avec OpenAI API :", error);
        return "Désolé, une erreur est survenue. Veuillez réessayer plus tard.";
    }
}

async function generateImage(prompt) {
    try {
        const response = await openai.images.generate({
            prompt, // Description textuelle pour l'image
            n: 1, // Nombre d'images générées
            size: "1024x1024", // Taille de l'image
        });

        return response.data[0].url;
    } catch (error) {
        console.error("Erreur avec DALL·E :", error);
        return null;
    }
}

module.exports = { getChatGPTResponse, generateImage };
