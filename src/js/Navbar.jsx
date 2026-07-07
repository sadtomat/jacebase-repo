import { Link } from "react-router-dom"
import '../css/Navbar.css'

export function Navbar() {
    return (
        <div class="topnav">
            <img src={`https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/Jacebase-logo.jpg`}/>
            <Link to="/">
                <button>Login</button>
            </Link>
            <Link to="/deck-entry">
                <button>Deck Entry</button>
            </Link>
            <Link to="/game-entry">
                <button>Game Entry</button>
            </Link>
            <Link to="/statistics">
                <button>Statistics</button>
            </Link>
            <h1>J a c e b a s e</h1>
        </div>
    )
}