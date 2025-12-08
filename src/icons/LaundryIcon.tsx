import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export const LaundryIcon = ({ size = 24, strokeWidth = 2, ...props }: Props) => (
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
    {...props}
  >
    <path d="M3 6h3" />
    <path d="M17 6h.01" />
    <rect width="18" height="20" x="3" y="2" rx="2" />
    <circle cx="12" cy="13" r="5" />
    <path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" />
  </svg>
);
