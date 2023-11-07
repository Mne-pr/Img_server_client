import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './Main_mutant'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route exact path="/" element={<Main servType=""/>} />
            <Route path="/simulate" element={<Main servType="simulate"/>} />
        </Routes>
    </Router>
)

