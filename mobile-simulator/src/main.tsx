import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer'
import "drag-drop-touch"
import process from 'process'

window.Buffer = Buffer
window.process = process

import './index.css'
import App from './App.tsx'
createRoot(document.getElementById('root')!).render(
    <App />
)
