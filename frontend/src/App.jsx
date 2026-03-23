import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Record from './pages/Record'
import AudioDetail from './pages/AudioDetail'
import { Login, Register } from './components/Authentication'
import './App.css'
import Projects from './pages/Projects'




const AppContent = () => (
    <div className="App">
        <Navigation />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/record" element={<Record />} />
            <Route path="/audio/:id" element={<AudioDetail />} />
            <Route path="*" element={<h2>404 Not Found</h2>} />
            <Route path="/projects" element={<Projects />} />
        </Routes>
    </div>
)

const App = () => (
    <AuthProvider>
        <Router>
            <AppContent />
        </Router>
    </AuthProvider>
)

export default App