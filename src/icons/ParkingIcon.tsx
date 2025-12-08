import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export const ParkingIcon = ({ size = 24, strokeWidth = 2, ...props }: Props) => (
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
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
);
