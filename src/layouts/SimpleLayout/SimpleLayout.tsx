import { Outlet } from "react-router-dom";
import { SimpleHeader } from "./SimpleHeader";

interface SimpleLayoutProps {
    header?: boolean;
    className?: string;
}

export function SimpleLayout(props: SimpleLayoutProps) {
    return (
        <div className={'min-h-screen flex flex-col antialiased' + (props.className ? ' ' + props.className : '')}>
            {(props.header !== false) && <SimpleHeader />}
            <div className='my-auto'>
                <Outlet />
            </div>
        </div>
    );
}