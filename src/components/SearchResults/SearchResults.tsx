import { ResultMessage, Loader } from "@/components";
import { HotelOffer } from "@/types/location";
import { InfoIcon, ErrorIcon } from "@/icons";
import { TourCard } from "../TourCard/TourCard";
import { getPluralForm } from "@/utils";

import "./SearchResults.scss";

type SearchResultsProps = {
  offers: HotelOffer[] | null;
  loading: boolean;
  error: Error | null;
};

export function SearchResults({ offers, loading, error }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="results-message-wrapper">
        <Loader message="Шукаємо найкращі пропозиції..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-message-wrapper">
        <ResultMessage icon={<ErrorIcon size={50} color="#d32f2f" />} title="Помилка" message={error.message} />
      </div>
    );
  }

  if (offers && offers.length === 0) {
    return (
      <div className="results-message-wrapper">
        <ResultMessage
          icon={<InfoIcon size={50} color="#ffb116" />}
          title="Результати відсутні"
          message="На жаль, за вашим запитом нічого не знайдено."
        />
      </div>
    );
  }

  if (!offers) {
    return null;
  }

  const pruralForm = getPluralForm(offers.length, "тур", "тури", "турів");

  return (
    <div className="results">
      <h2 className="results__title">
        Знайдено {offers.length} {pruralForm}
      </h2>
      <div className="results__grid">
        {offers.map((offer) => (
          <TourCard key={offer.id} tour={offer} />
        ))}
      </div>
    </div>
  );
}
