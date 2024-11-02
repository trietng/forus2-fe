import { Outlet } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import { SimpleHeader } from "./SimpleHeader";
import { customTheme } from "../theme";

interface SimpleLayoutProps {
    header?: boolean;
    className?: string;
}

export function SimpleLayout(props: SimpleLayoutProps) {
    return (
        <Flowbite theme={{theme: customTheme}}>
            <div className={'min-h-screen flex flex-col antialiased' + (props.className ? ' ' + props.className : '')}>
                {(props.header !== false) && <SimpleHeader />}
                <div className='my-auto'>
                    <Outlet />
                </div>
            </div>
        </Flowbite>
    );
}