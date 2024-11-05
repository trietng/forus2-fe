import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Avatar } from "flowbite-react";
import { getDecodedPayload } from '../../helpers/jwt';
import { Payload } from "../../models/payload";
import { UserRoleMap } from "../../models/role";
import { api } from "../../api";
import { AVATAR_THUMBNAIL_HEIGHT } from "../../constants/validation";
import { getThumbnail } from "../../firebase/thumbnail";
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export function ProfileDropdown() {
    const navigate = useNavigate();
    const [user] = useState<Payload | undefined>(getDecodedPayload());
    const [avatar, setAvatar] = useState<string>();

    async function fetchAvatar() {
        if (user?.avatarUrl) {
            const data = await getThumbnail(user.avatarUrl, AVATAR_THUMBNAIL_HEIGHT)
            if (data && typeof data === 'string') {
                setAvatar(data);
            }
        }
    }

    useEffect(() => {
        fetchAvatar();
    }, []);

    async function logout() {
        await api.delete('v1/auth/logout');
        navigate('/login');
    }
        
    return (
        <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar img={avatar}/>
            }
            placement="bottom-end"
            >
            <Dropdown.Header>
                <span className="block text-sm font-medium">{user?.username}</span>
                {user?.role && <span className="block text-sm">{UserRoleMap[user.role]}</span>}
            </Dropdown.Header>
            <Dropdown.Item as={Link} to="/settings"><Cog6ToothIcon className="mr-2 inline size-4"/> Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => logout()}><ArrowLeftStartOnRectangleIcon className="mr-2 inline size-4"/> Logout</Dropdown.Item>
        </Dropdown>
    );
}