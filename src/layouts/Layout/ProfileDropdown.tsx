import { Dropdown, Avatar } from "flowbite-react";
import { useState } from "react";
import { getDecodedPayload } from '../../helpers/jwt';
import { Link } from "react-router-dom";
import { Payload } from "../../models/payload";
import { UserRoleMap } from "../../models/role";

export function ProfileDropdown() {
    const [user] = useState<Payload | undefined>(getDecodedPayload());

    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar alt="User settings" img={user?.avatarUrl} />
            }>
            <Dropdown.Header>
                <span className="block text-sm font-medium">{user?.username}</span>
                {user?.role && <span className="block text-sm">{UserRoleMap[user.role]}</span>}
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
    );
}