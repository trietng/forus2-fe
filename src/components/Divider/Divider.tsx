interface DividerProps {
    className?: string;
}

export function Divider(props: DividerProps) {
    return (
        <div className={'h-[1px] bg-gray-200' + (props.className ? ' ' + props.className : '')}></div>
    );
}