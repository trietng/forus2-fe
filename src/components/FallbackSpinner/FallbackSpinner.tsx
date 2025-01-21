import { Spinner } from "@heroui/react";
import { Ref } from "react";

interface FallbackSpinnerProps {
    className?: string;
    ref?: Ref<HTMLElement | null>
}

export function FallbackSpinner(props: FallbackSpinnerProps) {
    return (
        <div className={"relative w-full" + (props.className ? " " + props.className : "")}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Spinner color="secondary" ref={props.ref}/>
            </div>
        </div>
    );
}