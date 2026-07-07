import { Link } from "react-router-dom"

export function Navbar() {
    return (
        <>
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
        </>
    )
}