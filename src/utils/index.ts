import { CityIcon, CountryIcon, HotelIcon } from "@/icons";
import { Hotel } from "@/types/api";
import { LocationItems } from "@/types/location";

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

type Searchable = Partial<Pick<Hotel, "name" | "cityName" | "countryName">>;

export function getIcon(name: IconName) {
  return iconMap[name]?.icon ?? null;
}

export function getTypeLabel(name: IconName) {
  return iconMap[name]?.name ?? null;
}

export function getMapLabel(name: IconName) {
  return iconMap[name]?.name ?? null;
}

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
