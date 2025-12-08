import { GeoEntity, HotelsMap, PriceOffer } from "@/types/api";
import { HotelOffer, LocationItems, Searchable } from "@/types/location";

// Create LocationItems from GeoEntity or fallback to raw input
export function createLocationItem(item: GeoEntity | null, inputValue: string): LocationItems {
  if (!item) {
    return { countryId: inputValue, itemId: inputValue, value: inputValue };
  }

  const isCountry = "flag" in item;
  return {
    countryId: isCountry ? item.id : item.countryId,
    itemId: String(item.id),
    value: inputValue,
  };
}

// Generic search function for GeoEntity-like records
export function findMatch<T extends Searchable>(data: Record<string, T> | null | undefined, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) return [];

  if (!data) return [];

  const result: T[] = [];

  for (const key in data) {
    const item = data[key];

    const name = item.name?.toLowerCase() ?? "";
    const cityName = item.cityName?.toLowerCase() ?? "";
    const countryName = item.countryName?.toLowerCase() ?? "";

    if (name.includes(normalized) || cityName.includes(normalized) || countryName.includes(normalized)) {
      result.push(item);
    }
  }

  return result;
}

// Rethrow error from fetch response or generic error
export async function rethrowResponseError(error: unknown, defaultMessage = "Request failed") {
  if (error instanceof Response) {
    const errorData = await error.json();
    throw new Error(errorData?.message || error.statusText || defaultMessage);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(defaultMessage);
}

// Merge raw price offers with hotels; keeps hotel fields and stores price id separately
export function mergeOffersWithHotels(prices: Record<string, PriceOffer>, hotels: HotelsMap): HotelOffer[] {
  return Object.values(prices).reduce<HotelOffer[]>((acc, price) => {
    if (!price.hotelID) return acc;
    const hotel = hotels[price.hotelID];
    if (!hotel) return acc;

    const { id: priceId, ...rest } = price;
    acc.push({ ...hotel, ...rest, priceId });
    return acc;
  }, []);
}

// Filter offers by selected id; returns empty array if none match
export function getFilteredAndSortedOffers(
  offers: HotelOffer[],
  selectedId: string | number
): HotelOffer[] {
  const filtered = offers.filter(
    (offer) =>
      String(offer.cityId) === String(selectedId) ||
      String(offer.countryId) === String(selectedId) ||
      String(offer.hotelID) === String(selectedId)
  );

  // sort by amount (ascending)
  return filtered.sort((a, b) => (a.amount ?? 0) - (b.amount ?? 0));
}
