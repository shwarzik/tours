import { Routes, Route } from 'react-router-dom'
import { HomePage, TourPage } from '@/pages'
import '@/App.css'

function App() {
  return (
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tour/:priceId/:hotelId" element={<TourPage />} />
        </Routes>
      </div>
  )
}

export default App