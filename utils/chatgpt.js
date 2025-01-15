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

module.exports = { getChatGPTResponse };
