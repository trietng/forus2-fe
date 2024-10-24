import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { SearchBar } from '../../components/SearchBar';

export function Header() {

    return (
        <header className='px-10 py-4 bg-primary sticky top-0'>
            <Navbar fluid rounded className='bg-transparent'>
                <div className="flex">
                    <Navbar.Brand href="/">
                        <img src="/assets/logo.svg" alt="logo" className="w-32" />
                    </Navbar.Brand>
                    <SearchBar/>
                </div>
                <div className="flex">
                    <Dropdown
                    arrowIcon={false}
                    inline
                    label={
                        <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
                    }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">Bonnie Green</span>
                            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
                        </Dropdown.Header>
                        <Dropdown.Item>Profile</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                </div>
            </Navbar>
        </header>
    )
}