import { Navbar } from 'flowbite-react';
import { SearchBar } from '../../components/SearchBar';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
    searchDisabled?: boolean;
}

export function Header(props: HeaderProps) {
    return (
        <header className='sticky top-0 z-50'>
            <Navbar className='bg-primary md:px-10 px-4 py-4'>
                <div className="flex flex-col md:flex-row m-auto md:m-0 gap-4 flex-1">
                    <div className="flex justify-between">
                        <Navbar.Brand href="/">
                            <img src="/assets/logo.svg" alt="logo" className="w-32" />
                        </Navbar.Brand>
                        <div className='md:hidden'>
                            <ProfileDropdown />
                        </div>
                    </div>
                    {!props.searchDisabled && <SearchBar />}
                </div>
                <div className='hidden md:block'>
                    <ProfileDropdown />
                </div>
            </Navbar>
        </header>
    )
}