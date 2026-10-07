import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import TaskPage from './pages/TaskPage'


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/projects/:projectId/tasks" element={<TaskPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App