import {Client} from "pg";
import fs from "fs";

const dbConfig = {
    host: process.env.REACT_APP_DB_HOST || "localhost",
    port: process.env.REACT_APP_DB_PORT ? parseInt(process.env.REACT_APP_DB_PORT) : 5432,
    ssl: (process.env.REACT_APP_DB_HOST && process.env.REACT_APP_DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
    user: process.env.REACT_APP_DB_USER || "postgres",
    password: process.env.REACT_APP_DB_PASS || "postgres",
    database: "jacebase-db" // Connect to the default database
};

export async function fetchPlayerData() {
    const client = new Client(dbConfig);
    console.log("enter fetch");
    console.log("dbConfig:", dbConfig);
    try {
        const query = `
        SELECT * FROM public."playerInstance"
        `;
        console.log("pre query");
        const result = await client.query(query);
        console.log("post query");
        return result.rows;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        await client.end();
    }
}