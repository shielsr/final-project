import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Record from './pages/Record'
import AudioDetail from './pages/AudioDetail'
import AudioList from './pages/AudioList'
import { Login, Register } from './components/Authentication'
import './App.css'
import Projects from './pages/Projects'
import ProjectNew from './pages/ProjectNew'
import ProjectDetail from './pages/ProjectDetail'
import { Navbar1 } from '@/components/ui/navbar1'
import Search from './pages/Search'
import Profile from './pages/Profile'

const AppContent = () => (
    <div className="App">
        <Navigation />
        <main className="p-4">
            <div className="max-w-2xl mx-auto">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/record" element={<Record />} />
                    <Route path="/audio" element={<AudioList />} />
                    <Route path="/audio/:id" element={<AudioDetail />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/new" element={<ProjectNew />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<h2>404 Not Found</h2>} />
                </Routes>
            </div>
        </main>
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