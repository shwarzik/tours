import { SearchForm } from "@/components/SearchForm/SearchForm";

import "./HomePage.css";

export function HomePage() {
  return (
    <div className="home-page">
      <h1 className="home-page__title">Пошук турів</h1>
      <SearchForm />
    </div>
  );
}
