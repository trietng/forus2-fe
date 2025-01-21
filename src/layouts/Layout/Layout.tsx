import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps extends PropsWithChildren {
    searchDisabled?: boolean;
}

export function Layout(props: LayoutProps) {
    return (
        <>
            <div className='flex flex-col min-h-screen antialiased text-slate-400 bg-forus-body-primary text-white'>
                <Header searchDisabled={props.searchDisabled}/>
                <div className='mx-4 md:mx-8 flex flex-grow my-1'>
                    {props.children || <Outlet />}
                </div>
                <Footer />
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition={Bounce}
            />
        </>
    );
}