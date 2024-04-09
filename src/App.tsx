import './App.css'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Test from '@src/pages/Test'
import { emqxInit } from './util/emqx';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid'

function App() {
  const [isInit, setInit] = useState(0)
  
  useEffect(() => {
    emqxInit(v4())
    console.info('app init',isInit)
    setInit(1)
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/JellyfishWeb/" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
