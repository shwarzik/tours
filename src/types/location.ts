import { Hotel, PriceOffer } from "./api";

export type LocationItems = {
  countryId: string | number;
  itemId: string | number;
  value?: string;
  isCountry?: boolean;
};

export type Searchable = Partial<Pick<Hotel, "name" | "cityName" | "countryName">>;

export type HotelOffer = Hotel & Omit<PriceOffer, "id"> & { priceId: string };
