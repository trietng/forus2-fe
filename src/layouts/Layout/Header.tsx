import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react';
import { SearchBar } from '../../components/SearchBar';
import { CSSProperties } from 'react';
import { ProfileDropdown } from './ProfileDropdown';
import { SideMenuDropdown } from '../../components/SideMenu';

interface HeaderProps {
    searchDisabled?: boolean;
}

interface CustomCSSProperties extends CSSProperties {
    '--navbar-height'?: string;
}

export function Header(props: HeaderProps) {
    return (
        <header className='sticky top-0 z-50'>
            <Navbar className='bg-forus-primary md:px-10 px-4 py-4 flex-grow' style={{ '--navbar-height': 'fit-content' } as CustomCSSProperties}>
                <NavbarContent>
                    <div className="flex flex-col md:flex-row m-auto md:m-0 gap-4 flex-1">
                        <div className="flex justify-between">
                            <div>
                                <div className='md:hidden inline-block'>
                                    <SideMenuDropdown />
                                </div>
                                <NavbarBrand className="inline-block cursor-pointer" onClick={() => window.location.href = '/'} >
                                    <img src="/assets/logo.svg" alt="logo" className="w-32" />
                                </NavbarBrand>
                            </div>
                            <div className='md:hidden'>
                                <ProfileDropdown />
                            </div>
                        </div>
                        {!props.searchDisabled && <SearchBar />}
                    </div>
                    <div className='hidden md:block'>
                        <ProfileDropdown />
                    </div>
                </NavbarContent>
            </Navbar>
        </header>
    )
}