import { RefObject, useEffect, useState } from "react";

export const useIsOpenDropdown = (ref: RefObject<HTMLElement | null>) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
  };
};
