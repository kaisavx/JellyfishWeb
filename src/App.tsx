import { useState } from 'react'
import './App.css'
import React, { Suspense, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Tuner from '@src/pages/Tuner'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/JellyfishTuner/" element={<Tuner />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
