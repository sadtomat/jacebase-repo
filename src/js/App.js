import logo from '../logo.svg';
import '../css/App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Login } from './login'
import { GameEntry } from './game-entry'
import { DeckENtry } from './deck-entry'
import { Statistics } from './statistics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/deck-entry" element={<DeckEntry/>}/>
        <Route path="/game-entry" element={<GameEntry/>}/>
        <Route path="/statistics" element={<Statistics/>}/>
      </Routes>
    </Router>
  );
}

export default App;
