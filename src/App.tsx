import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Eyewear from './pages/Eyewear'
import Services from './pages/Services'
import BookAppointment from './pages/BookAppointment'
import Insurance from './pages/Insurance'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/eyewear" element={<Eyewear />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
