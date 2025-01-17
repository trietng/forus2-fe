interface FallbackSpinnerProps {
    className?: string;
}

export function FallbackSpinner(props: FallbackSpinnerProps) {
    return (
        <div className={"relative w-full" + (props.className ? " " + props.className : "")}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                
            </div>
        </div>
    );
}