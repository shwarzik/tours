import { FormEvent, useState } from "react";

import { getStartSearchPrices } from "@/api/endpoints";
import { LocationItems } from "@/types/location";
import { useFetch } from "@/hooks/useFetch";
import { initialSelection } from "@/utils";
import { SearchForm, SearchResults } from "@/components";

import "./HomePage.scss";

export function HomePage() {
  const [selectedItem, setSelectedItem] = useState<LocationItems>(initialSelection);
  const { countryId } = selectedItem;

  const {
    data: prices,
    isLoading: isPricesLoading,
    refetch: refetchPrices,
    error: pricesError,
  } = useFetch({
    key: `prices-${countryId}`,
    queryFn: () => getStartSearchPrices(String(countryId)),
    enabled: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetchPrices();
  };

  return (
    <div className="home-page">
      <h1 className="home-page__title">Пошук турів</h1>
      <SearchForm
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        onSubmit={handleSubmit}
        isPricesLoading={isPricesLoading}
      />
      <SearchResults prices={prices} loading={isPricesLoading} error={pricesError} />
    </div>
  );
}
