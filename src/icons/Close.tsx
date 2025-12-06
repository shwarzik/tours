import React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export const Close: React.FC<Props> = ({ size = 24, strokeWidth = 2, className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className ?? ""}
    {...props}
  >
    <path d="M18 6 L6 18" />
    <path d="M6 6 L18 18" />
  </svg>
);
