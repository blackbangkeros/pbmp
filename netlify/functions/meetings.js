// netlify/functions/meetings.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

exports.handler = async function(event, context) {
    // This function will handle different actions based on the request
    // For now, it's a placeholder. In a real app, you'd add logic here
    // to get meetings, create meetings, update agendas, etc.

    // Example: Fetching upcoming meetings
    try {
        const { rows } = await pool.query("SELECT * FROM meetings WHERE status = 'Scheduled' ORDER BY meeting_date ASC");
        return {
            statusCode: 200,
            body: JSON.stringify(rows),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch meetings" }),
        };
    }
};
