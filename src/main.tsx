import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.tsx'
import { SaveLocallyProvider } from './hooks/use-save-locally.tsx'
import { ThemeProvider } from './hooks/use-theme.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SaveLocallyProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SaveLocallyProvider>
    </ThemeProvider>
  </StrictMode>,
)
