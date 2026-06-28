import { BrowserRouter, Routes, Route } from 'react-router-dom'
import VisitTracker from './components/VisitTracker'
import MessageBubble from './components/MessageBubble'
import Home from './pages/Home'
import BookAppointment from './pages/BookAppointment'
import AdminLogin from './pages/AdminLogin'
import AdminUpdatePassword from './pages/AdminUpdatePassword'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <VisitTracker />
      <MessageBubble />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/update-password" element={<AdminUpdatePassword />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
