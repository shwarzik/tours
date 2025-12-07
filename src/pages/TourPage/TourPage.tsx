import { Link } from "react-router-dom";

export function TourPage() {
  return (
    <div>
      <Link to="/" className="tour-page__back-link">
        ← Повернутися до пошуку
      </Link>
      <h1>Welcome to the Tour Page</h1>
    </div>
  );
}
