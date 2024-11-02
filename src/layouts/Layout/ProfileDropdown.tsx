import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Avatar } from "flowbite-react";
import { getDecodedPayload } from '../../helpers/jwt';
import { Payload } from "../../models/payload";
import { UserRoleMap } from "../../models/role";
import { api } from "../../api";

export function ProfileDropdown() {
    const navigate = useNavigate();
    const [user] = useState<Payload | undefined>(getDecodedPayload());

    async function logout() {
        await api.delete('v1/auth/logout');
        navigate('/login');
    }
        
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar img={user?.avatarUrl}/>
            }
            placement="bottom-end"
            >
            <Dropdown.Header>
                <span className="block text-sm font-medium">{user?.username}</span>
                {user?.role && <span className="block text-sm">{UserRoleMap[user.role]}</span>}
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => logout()}>Sign out</Dropdown.Item>
        </Dropdown>
    );
}