import { FormEvent, useLayoutEffect, useRef } from "react";

import { getStartSearchPrices } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { filterOffersBySelection, mergeOffersWithHotels } from "@/utils";
import { LocationItems } from "@/types/location";
import { SearchForm, SearchResults } from "@/components";
import { useSearch } from "@/context/SearchContext";

import "./HomePage.scss";

export function HomePage() {
  const { selectedItem, setSelectedItem } = useSearch();
  const submittedItemIdRef = useRef<string | number>("");
  const { countryId } = selectedItem;

  const {
    data: offersData,
    isLoading: isOffersLoading,
    refetch: refetchOffers,
    error: offersError,
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

  useLayoutEffect(() => {
    if (!countryId) return;
    submittedItemIdRef.current = countryId;
    refetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mergedOffers = mergeOffersWithHotels(offersData?.prices ?? {}, offersData?.hotels ?? {});
  const submittedItemId = submittedItemIdRef.current;
  const offers = offersData && submittedItemId ? filterOffersBySelection(mergedOffers, submittedItemId) : null;

  return (
    <div className="home-page">
      <h1 className="home-page__title">Пошук турів</h1>
      <SearchForm
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        onSubmit={handleSubmit}
        isPricesLoading={isOffersLoading}
      />
      <SearchResults offers={offers} loading={isOffersLoading} error={offersError} />
    </div>
  );
}
