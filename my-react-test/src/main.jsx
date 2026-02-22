// Import React's DOM integration function
import { createRoot } from 'react-dom/client'

// Import our main App component
import { App } from './App.jsx'

// Find the 'root' div in index.html and render our App component into it
createRoot(document.getElementById('root')).render(<App />)