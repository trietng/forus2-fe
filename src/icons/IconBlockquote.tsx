// icon:blockquote | Tabler Icons https://tablericons.com/ | Csaba Kissi
import { SVGProps } from "react";

export function IconBlockquote(props: SVGProps<SVGSVGElement>) {
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
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M6 15h15M21 19H6M15 11h6M21 7h-6M9 9h1a1 1 0 11-1 1V7.5a2 2 0 012-2M3 9h1a1 1 0 11-1 1V7.5a2 2 0 012-2" />
        </svg>
    );
}