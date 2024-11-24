// icon:pilcrow | Lucide https://lucide.dev/ | Lucide
import { SVGProps } from "react";

export function IconHeading1(props: SVGProps<SVGSVGElement>) {
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
            <path d="M4 12h8M4 18V6M12 18V6M17 12l3-2v8" />
        </svg>
    );
}