import { getCountries as fetchCountries, searchGeo } from "./api";
import type { GeoEntity } from "@/types/api";

export const getCountries = async () => {
  try {
    const response = await fetchCountries();
    const data = await response.json();

    return data as Record<string, GeoEntity>;
  } catch (err) {
    return `Failed to load countries: ${err}`;
  }
};

export const getSearch = async (query: string) => {
  try {
    const response = await searchGeo(query);
    const data = await response.json();

    return data as Record<string, GeoEntity>;
  } catch (err) {
    return `Failed to load search results: ${err}`;
  }
};
