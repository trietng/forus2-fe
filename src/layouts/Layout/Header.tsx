import { Navbar, Dropdown, Avatar } from 'flowbite-react';
import { Logo } from '../../components/Logo';

export function Header() {

    return (
        <header className='px-10 py-5 border-b bg-primary sticky top-0'>
            <Navbar fluid rounded className='bg-transparent'>
                <Navbar.Brand href="/">
                    <img src="/assets/logo.svg" alt="logo" className="w-32" />
                </Navbar.Brand>
                <div className='text-white'>search bar here</div>
                <div className="flex md:order-2">
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