import { Link } from "react-router-dom"
import '../css/Navbar.css'

export function Navbar() {
    return (
        <div class="topnav">
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