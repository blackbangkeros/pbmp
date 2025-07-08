// netlify/functions/api.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Helper function to call Gemini API
async function callGeminiAPI(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const result = await response.json();
        return result.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Error connecting to the AI service.`;
    }
}

exports.handler = async function(event, context) {
    const { action, role } = event.queryStringParameters;

    if (action === 'getAIGuide') {
        let guidePrompt = '';
        switch(role) {
            case 'chairperson':
                guidePrompt = "As a Luntian AI Guide, provide a concise checklist for a Cooperative Chairperson on how to effectively preside over a Board of Directors meeting. Focus on maintaining order, following the agenda, and ensuring fair discussion based on parliamentary procedure.";
                break;
            case 'secretary':
                guidePrompt = "As a Luntian AI Guide, provide a concise checklist for a Cooperative Secretary's duties during a meeting. Focus on accurate minute-taking, recording motions and votes, and tracking action items.";
                break;
            case 'member':
                guidePrompt = "As a Luntian AI Guide, provide a concise checklist for a Cooperative Board Member on how to participate effectively in a meeting. Focus on active listening, constructive questioning, and fulfilling their fiduciary duty.";
                break;
            default:
                return { statusCode: 400, body: 'Invalid role specified.' };
        }

        const guideText = await callGeminiAPI(guidePrompt);
        return { statusCode: 200, body: JSON.stringify({ text: guideText }) };
    }

    // Add more actions here later, e.g., getMeetings, createMeeting, etc.

    return {
        statusCode: 400,
        body: 'No valid action specified.'
    };
};
