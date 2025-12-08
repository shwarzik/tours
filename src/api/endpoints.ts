import {
  getCountries as fetchCountries,
  searchGeo,
  startSearchPrices as fetchStartSearchPrices,
  getSearchPrices,
  getHotels as getHotelsAPI,
  getPrice as getPriceAPI,
  getHotel as getHotelAPI,
} from "./api";
import type { GeoEntity, HotelsMap, PricesMap, StartSearchResponse, PriceOffer, Hotel } from "@/types/api";
import { rethrowResponseError } from "@/utils";

export const getCountries = async () => {
  try {
    const response = await fetchCountries();
    const data = await response.json();

    return data as Record<string, GeoEntity>;
  } catch (error) {
    await rethrowResponseError(error, "Failed to load countries.");
  }
};

export const getSearch = async (query: string) => {
  try {
    const response = await searchGeo(query);
    const data = await response.json();

    return data as Record<string, GeoEntity>;
  } catch (error) {
    await rethrowResponseError(error, "Failed to load search results.");
  }
};

export const getStartSearchPrices = async (countryID: string): Promise<{ prices: PricesMap; hotels: HotelsMap }> => {
  try {
    const responseToken = await fetchStartSearchPrices(countryID);
    const tokenData: StartSearchResponse = await responseToken.json();
    const waitMs = new Date(tokenData.waitUntil).getTime() - Date.now();

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const responsePrices = await getSearchPrices(tokenData.token);
    const responseHotels = await getHotelsAPI(countryID);
    const pricesData: { prices: PricesMap } = await responsePrices.json();
    const hotelsData: HotelsMap = await responseHotels.json();

    return { prices: pricesData.prices, hotels: hotelsData };
  } catch (error) {
    await rethrowResponseError(error, "Failed to load start search tokens.");
    // rethrowResponseError always throws; this return satisfies TypeScript
    throw new Error("Unreachable");
  }
};

export const getPrice = async (id: string): Promise<PriceOffer | null> => {
  try {
    const response = await getPriceAPI(id);
    const data = await response.json();

    return data as PriceOffer;
  } catch (error) {
    await rethrowResponseError(error, "Failed to load price data.");
    return null;
  }
};

export const getHotel = async (id: number): Promise<Hotel | null> => {
  try {
    const response = await getHotelAPI(id);
    const data = await response.json();

    return data as Hotel;
  } catch (error) {
    await rethrowResponseError(error, "Failed to load hotel data.");
    return null;
  }
};
