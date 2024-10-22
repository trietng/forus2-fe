import { ReactNode } from "react";

interface ErrorWrapperProps {
    children: ReactNode;
}

export function ErrorWrapper(props: ErrorWrapperProps) {
    return (
        <div className="relative self-center left-1/2 -translate-x-1/2">
            {props.children}
        </div>
    );
}