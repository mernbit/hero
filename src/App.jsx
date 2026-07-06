import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Restaurant from './pages/Restaurant'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/:slug" element={<Restaurant />} />
        <Route path="*" element={<Navigate to="/the-creamery" replace />} />
      </Routes>
    </Router>
  )
}

export default App