import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'

/**
 * Vstupní bod aplikace — inicializuje React a připojí App komponentu do DOM.
 *
 * createRoot() vytvoří React root na elementu s id "root_" v index.html.
 * StrictMode aktivuje dodatečné kontroly a varování v dev prostředí:
 *   - dvojité volání render funkcí pro detekci vedlejších efektů
 *   - varování při použití zastaralých React API
 *   - varování při nesprávném použití ref
 *
 * StrictMode nemá žádný vliv na produkční build.
 */
createRoot(document.getElementById('root_')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)