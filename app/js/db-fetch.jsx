const { Client } = require("pg");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: (process.env.DB_HOST && process.env.DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: "jacebase-db" // Connect to the default database
};

async function fetchPlayerData() {
    const client = new Client(dbConfig);
    try {
        const query = `
        SELECT * FROM public."playerInstance"
        `;
        const result = await client.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        await client.end();
    }
}