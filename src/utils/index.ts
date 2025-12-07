import { CityIcon, CountryIcon, HotelIcon } from "@/icons";
import { HotelsMap, PriceOffer } from "@/types/api";
import { HotelOffer, LocationItems, Searchable } from "@/types/location";

const iconMap = {
  country: {
    icon: CountryIcon,
    name: "Країна",
  },
  city: {
    icon: CityIcon,
    name: "Місто",
  },
  hotel: {
    icon: HotelIcon,
    name: "Готель",
  },
} as const;

export const phaseMapping = {
  loading: "Завантаження...",
  empty: "Нічого не знайдено",
  done: "",
};

export const initialSelection: LocationItems = {
  countryId: "",
  itemId: "",
  type: "country",
};

export type IconName = keyof typeof iconMap;

// For dropdown icons and similar UI elements
export function getIcon(name: IconName) {
  return iconMap[name]?.icon ?? null;
}
// For dropdown labels and similar UI elements
export function getTypeLabel(name: IconName) {
  return iconMap[name]?.name ?? null;
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
export function filterOffersBySelection(offers: HotelOffer[], selectedId: string | number): HotelOffer[] {
  return offers.filter(
    (offer) => offer.cityId === selectedId || offer.countryId === selectedId || offer.hotelID === selectedId,
  );
}

// Get correct plural form for Ukrainian nouns based on count
export function getPluralForm(count: number, one: string, few: string, many: string) {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

