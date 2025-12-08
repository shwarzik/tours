import { LocationItems } from "@/types/location";
import {
  WiFiIcon,
  AquaparkIcon,
  TennisIcon,
  LaundryIcon,
  ParkingIcon,
  CountryIcon,
  CityIcon,
  HotelIcon,
} from "@/icons";

const labels = {
  wifi: {
    name: "Wi-Fi",
    icon: WiFiIcon,
  },
  aquapark: {
    name: "Аквапарк",
    icon: AquaparkIcon,
  },
  tennis_court: {
    name: "Тенісний корт",
    icon: TennisIcon,
  },
  laundry: {
    name: "Пральня",
    icon: LaundryIcon,
  },
  parking: {
    name: "Парковка",
    icon: ParkingIcon,
  },
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
  value: "",
};

export type IconLabel = keyof typeof labels;

export function getIcon(name: IconLabel) {
  return labels[name]?.icon ?? null;
}
// For dropdown labels and similar UI elements
export function getTypeLabel(name: IconLabel) {
  return labels[name]?.name ?? null;
}
