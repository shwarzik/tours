import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export const InfoIcon = ({ size = 24, strokeWidth = 2, ...props }: Props) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
