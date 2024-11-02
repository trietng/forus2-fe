import { Outlet } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { customTheme } from '../theme';

export function Layout() {
    return (
        <Flowbite theme={{theme: customTheme}}>
            <div className='flex flex-col min-h-screen antialiased text-slate-400 bg-body-primary text-white'>
                <Header />
                <div className='mx-8 flex flex-grow my-1'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </Flowbite>
    );
}