import { ButtonHTMLAttributes } from "react";

import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "icon";
};

export function Button({ children, variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button className={`button ${variant ? `button--${variant}` : ""} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}
