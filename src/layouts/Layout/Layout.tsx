import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
    return (
        <div className='flex flex-col min-h-screen antialiased text-slate-400 bg-blue-900'>
            {/* Hidden div for csrf */}
            <div className='hidden'>
                <input type='hidden' name='csrfmiddlewaretoken' value='{{ csrf_token }}' />
            </div>
            <Header />
            <div className='mx-8 flex flex-grow my-1'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}