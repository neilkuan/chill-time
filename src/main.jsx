import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import i18n configuration
import './i18n.js'

// Set the HTML lang attribute based on the stored language or browser language
const storedLanguage = localStorage.getItem('i18nextLng') || navigator.language || 'en';
document.documentElement.setAttribute('lang', storedLanguage);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 