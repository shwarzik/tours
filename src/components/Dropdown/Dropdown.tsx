import { InputHTMLAttributes, ReactNode, useEffect, useRef } from "react";

import { phaseMapping } from "@/utils";
import { Input } from "@/components";

import "./Dropdown.scss";

type DropdownProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  onChange: (value: string) => void;
  label?: string;
  children: ReactNode;
  phase: "empty" | "loading" | "done";
};

export function Dropdown({
  value,
  onChange,
  isDropdownOpen,
  setIsDropdownOpen,
  label,
  children,
  phase,
  ...props
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsDropdownOpen]);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <Input
        value={value}
        inputRef={inputRef}
        label={label}
        onChange={onChange}
        onFocus={() => setIsDropdownOpen(true)}
        {...props}
      />
      {isDropdownOpen && (
        <div className="dropdown">
          {phase === "done" ? <>{children}</> : <div className="dropdown__loading">{phaseMapping[phase]}</div>}
        </div>
      )}
    </div>
  );
}
