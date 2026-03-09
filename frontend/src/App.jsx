import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import PrivateComponent from './pages/PrivateComponent'
import Record from './pages/Record'
import { Login, Register } from './components/Authentication'
import './App.css'





const AppContent = () => (
  <div className="App">
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/private" element={<PrivateComponent />} />
      <Route path="/record" element={<Record />} />
      <Route path="*" element={<h2>404 Not Found</h2>} />
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