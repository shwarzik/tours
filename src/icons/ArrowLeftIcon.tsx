import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number;
};

export const ArrowLeftIcon = ({ size = 24, strokeWidth = 2, ...props }: Props) => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
