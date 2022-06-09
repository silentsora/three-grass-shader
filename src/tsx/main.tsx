import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '../less/style.less';

const container = document.getElementById('root');
const root = createRoot(container as Element)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
