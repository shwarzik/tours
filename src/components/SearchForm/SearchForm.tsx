import { FormEvent, useEffect, useRef, useState } from "react";

import { getCountries, getSearch } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { GeoEntity } from "@/types/api";
import { findMatch, getIcon, getTypeLabel, initialSelection } from "@/utils";
import { LocationItems } from "@/types/location";
import { Button, Dropdown } from "@/components";

import "./SearchForm.scss";

export function SearchForm({
  isPricesLoading,
  selectedItem,
  setSelectedItem,
  onSubmit,
}: {
  selectedItem: LocationItems;
  setSelectedItem: (selectedItem: LocationItems) => void;
  onSubmit: (e: FormEvent) => void;
  isPricesLoading: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const selectionUpdateRef = useRef(false);

  const isGreaterThanTwoChars = inputValue.length > 2;
  const { data: countriesData, isLoading: isCountriesLoading } = useFetch({
    key: "countries",
    queryFn: getCountries,
    enabled: isDropdownOpen,
  });

  const { data: searchData, isLoading: isSearchLoading } = useFetch({
    key: "search-countries",
    queryFn: () => getSearch(inputValue),
    enabled: isGreaterThanTwoChars,
  });

  const handleSelectItem = (item: GeoEntity) => {
    const isCountry = "flag" in item;
    selectionUpdateRef.current = true;
    setInputValue(item.name);
    setSelectedItem({
      countryId: isCountry ? item.id : item.countryId,
      itemId: item.id,
      type: isCountry ? "country" : item.type,
    });
    setIsDropdownOpen(false);
  };

  const matchedItems = findMatch<GeoEntity>(searchData ?? null, inputValue);

  const shouldShowAllCountries = !isGreaterThanTwoChars || Boolean(countriesData?.[selectedItem.itemId]);

  const dropdownItems: GeoEntity[] = shouldShowAllCountries
    ? Object.values(countriesData ?? {})
    : matchedItems;
  const isLoading = isCountriesLoading || isSearchLoading;
  const phase = isLoading ? "loading" : dropdownItems.length === 0 ? "empty" : "done";

  // Reset selection when the user types manually (not when picking from the list)
  useEffect(() => {
    if (selectionUpdateRef.current) {
      selectionUpdateRef.current = false;
      return;
    }

    setSelectedItem({...initialSelection, countryId: inputValue});
  }, [inputValue, setSelectedItem]);

  return (
    <form className="search-form" onSubmit={onSubmit}>
      <Dropdown
        value={inputValue}
        onChange={(value) => setInputValue(value)}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        phase={phase}
        label="Куди"
        placeholder="Країна, місто або готель"
      >
        <ul>
          {dropdownItems.map((item) => {
            const isCountry = "flag" in item;
            const Icon = isCountry ? getIcon("country") : getIcon(item.type);
            const typeLabel = isCountry ? getTypeLabel("country") : getTypeLabel(item.type);

            return (
              <li key={`${item.type}-${item.id}`} className="list__item" onClick={() => handleSelectItem(item)}>
                <span className="list__icon">{<Icon size={16} />}</span>
                <div className="list__info">
                  <span className="list__name">{item.name}</span>
                  <span className="list__type">{typeLabel}</span>
                </div>
                {isCountry && <img src={item.flag} alt={item.name} className="list__flag" />}
              </li>
            );
          })}
        </ul>
      </Dropdown>
      <Button type="submit" disabled={isLoading || isPricesLoading}>
        {isLoading ? "Пошук..." : "Знайти"}
      </Button>
    </form>
  );
}
