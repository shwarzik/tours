import { FormEvent, useState } from "react";

import { getStartSearchPrices } from "@/api/endpoints";
import { HotelsMap, PricesMap } from "@/types/api";
import { LocationItems } from "@/types/location";
import { useFetch } from "@/hooks/useFetch";
import { filterOffersBySelection, initialSelection, mergeOffersWithHotels } from "@/utils";
import { SearchForm, SearchResults } from "@/components";

import "./HomePage.scss";

export function HomePage() {
  const [selectedItem, setSelectedItem] = useState<LocationItems>(initialSelection);
  const [submittedItemId, setSubmittedItemId] = useState<string | number>(initialSelection.itemId);
  const { countryId } = selectedItem;

  const {
    data: offersData,
    isLoading: isOffersLoading,
    refetch: refetchOffers,
    error: offersError,
  } = useFetch<{ prices: PricesMap; hotels: HotelsMap }>({
    key: `prices-${countryId}`,
    queryFn: () => getStartSearchPrices(String(countryId)),
    enabled: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedItemId(selectedItem.itemId);
    refetchOffers();
  };
  
  const mergedOffers = mergeOffersWithHotels(offersData?.prices ?? {}, offersData?.hotels ?? {});
  const offers = offersData ? filterOffersBySelection(mergedOffers, submittedItemId) : null;
  
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
