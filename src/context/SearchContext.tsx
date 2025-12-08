import { LocationItems } from "@/types/location";
import { initialSelection } from "@/utils";
import { createContext, useContext, useState, ReactNode } from "react";

type SearchContextType = {
  selectedItem: LocationItems;
  setSelectedItem: (value: LocationItems) => void;
  activeToken: string;
  setActiveToken: (value: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<LocationItems>(initialSelection);
  const [activeToken, setActiveToken] = useState<string>("");

  return <SearchContext.Provider value={{ selectedItem, setSelectedItem, activeToken, setActiveToken }}>{children}</SearchContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used inside SearchProvider");
  }
  return context;
};
