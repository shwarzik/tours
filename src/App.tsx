import { Routes, Route } from "react-router-dom";
import { HomePage, TourPage } from "@/pages";
import { SearchProvider } from "@/context/SearchContext";

function App() {
   

  return (
    <SearchProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tour/:priceId/:hotelId" element={<TourPage />} />
      </Routes>
    </SearchProvider>
  );
}

export default App;
