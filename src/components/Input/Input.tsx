import { ChangeEvent, InputHTMLAttributes, RefObject } from "react";

import { CloseIcon } from "@/icons";
import { Button } from "@/components";

import "./Input.scss";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  onChange: (value: string) => void;
  value: string;
  label?: string;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function Input({ value, inputRef, label, onChange, ...props }: InputProps) {
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
          {...props}
        />

        {value && (
          <Button type="button" variant="icon" className="input__close-icon" onClick={handleClear}>
            <CloseIcon size={16} />
          </Button>
        )}
      </div>
    </>
  );
}
