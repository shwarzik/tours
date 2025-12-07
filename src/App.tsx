import { Routes, Route } from "react-router-dom";
import { HomePage, TourPage } from "@/pages";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tour/:priceId/:hotelId" element={<TourPage />} />
    </Routes>
  );
}

export default App;
