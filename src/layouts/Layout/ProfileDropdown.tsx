import { Dropdown, Avatar } from "flowbite-react";
import { Link } from "react-router-dom";

export function ProfileDropdown() {
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
            }>
            <Dropdown.Header>
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
            {/* <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item> */}
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
    );
}