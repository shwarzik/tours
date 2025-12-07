import { ResultMessage, Loader } from "@/components";
import { InfoIcon, ErrorIcon } from "@/icons";

import "./SearchResults.scss";
import { PricesMap } from "@/types/api";

type SearchResultsProps = {
  prices: PricesMap | null;
  loading: boolean;
  error: Error | null;
};

export function SearchResults({ prices, loading, error }: SearchResultsProps) {
  const resultPrices = prices ? Object.values(prices.prices) : [];
  if (loading) {
    return (
      <div className="results">
        <Loader message="Шукаємо найкращі пропозиції..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="results">
        <ResultMessage icon={<ErrorIcon size={50} color="#d32f2f" />} title="Помилка" message={error.message} />
      </div>
    );
  }

  if (prices && resultPrices.length === 0) {
    return (
      <div className="results">
        <ResultMessage
          icon={<InfoIcon size={50} color="#ffb116" />}
          title="Результати відсутні"
          message="На жаль, за вашим запитом нічого не знайдено."
        />
      </div>
    );
  }

  return (
    <div className="results">
      {resultPrices.length > 0 && (
        <div className="search-results">
          <h2>Результати пошуку:</h2>
          <pre>{JSON.stringify(prices, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
