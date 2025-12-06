import { useRef, useState } from "react";

import { getCountries, getSearch } from "@/api/endpoints";
import { useIsOpenDropdown } from "@/hooks/useIsOpenDropdown";
import { useSmartQuery } from "@/hooks/useSmartQuery";
import { GeoEntity } from "@/types/api";
import { Input, Button, Dropdown } from "@/components";

import "./SearchForm.css";

export function SearchForm() {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isGreaterThanTwoChars = inputValue.length > 2;
  const { isDropdownOpen, setIsDropdownOpen } = useIsOpenDropdown(dropdownRef);
  const { data: countriesData, isLoading: isCountriesLoading } = useSmartQuery({
    key: "countries",
    queryFn: getCountries,
    enabled: isDropdownOpen,
  });

  const { data: searchData, isLoading: isSearchLoading } = useSmartQuery({
    key: "search-countries",
    queryFn: () => getSearch(inputValue),
    enabled: isGreaterThanTwoChars,
  });

  const handleSelectItem = (item: GeoEntity) => {
    setInputValue(item.name);
    setIsDropdownOpen(false);
  };

  const dropdownItems = isGreaterThanTwoChars ? searchData : countriesData;

  return (
    <form className="search-form">
      <div className="search-form__input-wrapper" ref={dropdownRef}>
        <Input
          value={inputValue}
          inputRef={inputRef}
          label="Куди"
          onChange={(value) => setInputValue(value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Країна, місто або готель"
        />
        {isDropdownOpen && (
          <Dropdown
            items={Object.values(dropdownItems || [])}
            onSelect={handleSelectItem}
            isLoading={isCountriesLoading || isSearchLoading}
          />
        )}
      </div>
      <Button type="submit" disabled={isCountriesLoading || isSearchLoading}>
        {isCountriesLoading || isSearchLoading ? "Пошук..." : "Знайти"}
      </Button>
    </form>
  );
}
