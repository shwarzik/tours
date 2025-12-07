import {
  getCountries as fetchCountries,
  searchGeo,
  startSearchPrices as fetchStartSearchPrices,
  getSearchPrices,
} from "./api";
import type { GeoEntity } from "@/types/api";
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

export const getStartSearchPrices = async (countryID: string) => {
  try {
    const responseToken = await fetchStartSearchPrices(countryID);
    const tokenData = await responseToken.json();
    const waitMs = new Date(tokenData.waitUntil).getTime() - Date.now();

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const responsePrices = await getSearchPrices(tokenData.token);
    const pricesData = await responsePrices.json();
    return pricesData;
  } catch (error) {
    await rethrowResponseError(error, "Failed to load start search tokens.");
  }
};
