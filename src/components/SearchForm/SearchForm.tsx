import { FormEvent, useState } from "react";

import { getCountries, getSearch } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { GeoEntity } from "@/types/api";
import { createLocationItem, findMatch, getIcon, getTypeLabel } from "@/utils";
import { LocationItems } from "@/types/location";
import { Button, Dropdown } from "@/components";

import "./SearchForm.scss";
import { useSearch } from "@/context/SearchContext";

export function SearchForm({
  isPricesLoading,
  onSubmit,
  onChangeStop,
}: {
  onSubmit: (e: FormEvent, selectedItem: LocationItems) => void;
  isPricesLoading: boolean;
  onChangeStop?: () => void;
}) {
  const { selectedItem, setSelectedItem } = useSearch();
  const [inputValue, setInputValue] = useState(selectedItem.value || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const matchedItems = findMatch<GeoEntity>(searchData ?? null, inputValue);
  const dropdownItems: GeoEntity[] = isGreaterThanTwoChars ? matchedItems : Object.values(countriesData ?? {});

  const isLoading = isCountriesLoading || isSearchLoading;
  const phase = isLoading ? "loading" : dropdownItems.length === 0 ? "empty" : "done";

  const handleSelectItem = (item: GeoEntity) => {
    setInputValue(item.name);
    const isCountry = "flag" in item;
    setSelectedItem({
      countryId: isCountry ? item.id : item.countryId,
      itemId: String(item.id),
    });
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newSelectedItem = createLocationItem(dropdownItems[0] ?? null, inputValue);
    setSelectedItem(newSelectedItem);
    onSubmit(e, newSelectedItem);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <Dropdown
        value={inputValue}
        onChange={(value) => {
          onChangeStop?.();
          setInputValue(value);
        }}
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
