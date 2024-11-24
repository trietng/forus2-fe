// icon:pilcrow | Lucide https://lucide.dev/ | Lucide
import { SVGProps } from "react";

export function IconPilcrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        {...props}
    >
        <path d="M13 4v16M17 4v16M19 4H9.5a4.5 4.5 0 000 9H13" />
    </svg>
  );
}
