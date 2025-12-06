import { ChangeEvent, InputHTMLAttributes, RefObject } from "react";
import { Button } from "@/components";
import { Close } from "@/icons";

import "./Input.css";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
  onFocus: () => void;
  value: string;
  label?: string;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function Input({ value, inputRef, label, onChange, onFocus, ...props }: InputProps) {
  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <>
      {label && <label className="input__label">{label}</label>}
      <div className="input__wrapper">
        <input
          ref={inputRef}
          type="text"
          className="input__field"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onFocus={onFocus}
          {...props}
        />

        {value && (
          <Button type="button" variant="icon" className="input__close-icon" onClick={handleClear}>
            <Close size={16} />
          </Button>
        )}
      </div>
    </>
  );
}
