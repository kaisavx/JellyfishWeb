import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Tuner from '@src/pages/Tuner'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/Jellyfish/" element={<Tuner />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
