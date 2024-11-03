import { Outlet } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { customTheme } from '../theme';

interface LayoutProps {
    searchDisabled?: boolean;
}

export function Layout(props: LayoutProps) {
    return (
        <Flowbite theme={{theme: customTheme}}>
            <div className='flex flex-col min-h-screen antialiased text-slate-400 bg-body-primary text-white'>
                <Header searchDisabled={props.searchDisabled}/>
                <div className='mx-4 md:mx-8 flex flex-grow my-1'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </Flowbite>
    );
}