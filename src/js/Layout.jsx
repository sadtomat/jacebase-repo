import { Navbar } from "./Navbar"
import { Outlet } from "react-router-dom"
import "../css/Layout.css"
// const { Client } = require("pg");

// const dbConfig = {
//     host: process.env.DB_HOST || "localhost",
//     port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
//     ssl: (process.env.DB_HOST && process.env.DB_HOST != 'localhost') ? { ca: fs.readFileSync('global-bundle.pem').toString() } : false,
//     user: process.env.DB_USER || "postgres",
//     password: process.env.DB_PASS || "postgres",
//     database: "jacebase-db" // Connect to the default database
// };


export function Layout() {
    // const client = new Client(dbConfig);
    // await client.connect;
    let jpgimage = `https://${process.env.REACT_APP_S3_BUCKET}.s3.${process.env.REACT_APP_S3_REGION}.amazonaws.com/background1.jpeg`
    console.log(jpgimage)
    const mainBackground = {
        backgroundSize: 'cover',
        backgroundImage: `url(${jpgimage})`,
    };
    return (
        <>
            <Navbar/>
            <main style={mainBackground}>
                <Outlet/>
            </main>
        </>
    )
}