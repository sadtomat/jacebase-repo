import '../css/App.css';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Login } from '../routes/login'
import { GameEntry } from '../routes/game-entry'
import { DeckEntry } from '../routes/deck-entry'
import { Statistics } from '../routes/statistics'
import { Layout } from "../routes/layout"


function App() {
  console.log("app");
  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Login/>}/>
          <Route path="/deck-entry" element={<DeckEntry/>}/>
          <Route path="/game-entry" element={<GameEntry/>}/>
          <Route path="/statistics" element={<Statistics/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
