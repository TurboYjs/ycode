import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
ReactDOM.render(
    <React.StrictMode>
        <Router basename={'/interview'}>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);