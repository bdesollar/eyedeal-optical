import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VisitTracker from './components/VisitTracker'
import MessageBubble from './components/MessageBubble'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <VisitTracker />
      <MessageBubble />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
