import { FormEvent, useLayoutEffect, useRef } from "react";

import { getStartSearchPrices } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { LocationItems } from "@/types/location";
import { SearchForm, SearchResults } from "@/components";
import { useSearch } from "@/context/SearchContext";
import { getFilteredAndSortedOffers, mergeOffersWithHotels } from "@/utils/search";

import "./HomePage.scss";

export function HomePage() {
  const { selectedItem } = useSearch();
  const { countryId } = selectedItem;
  const submittedItemIdRef = useRef<string | number | null>(null);

  const {
    data: offersData,
    isLoading: isOffersLoading,
    refetch: refetchOffers,
    error: offersError,
    stop: stopOffers,
  } = useFetch({
    key: `prices-${countryId}`,
    queryFn: () => getStartSearchPrices(String(countryId)),
    enabled: false,
  });

  const handleSubmit = (e: FormEvent, item: LocationItems) => {
    e.preventDefault();
    const value = item.value ? item.countryId : "";
    submittedItemIdRef.current = item.itemId;
    refetchOffers({
      key: `prices-${value}`,
      queryFn: () => getStartSearchPrices(String(value)),
    });
  };

  const mergedOffers = mergeOffersWithHotels(offersData?.prices ?? {}, offersData?.hotels ?? {});
  const submittedItemId = submittedItemIdRef.current;
  const offers = offersData && submittedItemId ? getFilteredAndSortedOffers(mergedOffers, submittedItemId) : null;

  const handleStop = () => {
    const token = offersData?.activeToken;
    if (!token) return;
    stopOffers(token);
  };

  useLayoutEffect(() => {
    if (!countryId) return;
    submittedItemIdRef.current = countryId;
    refetchOffers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="home-page">
      <h1 className="home-page__title">Пошук турів</h1>
      <SearchForm onSubmit={handleSubmit} isPricesLoading={isOffersLoading} onChangeStop={handleStop} />
      <SearchResults offers={offers} loading={isOffersLoading} error={offersError} />
    </div>
  );
}
