import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Avatar, DropdownMenu, DropdownTrigger, DropdownItem, DropdownSection } from "@heroui/react";
import { getDecodedPayload } from '../../helpers/jwt';
import { Payload } from "../../models/payload";
import { UserRoleMap } from "../../models/role";
import { api } from "../../api";
import { AVATAR_THUMBNAIL_HEIGHT } from "../../constants/thumbnail";
import { getFirebaseThumbnail } from "../../firebase/thumbnail";
import { ArrowLeftStartOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

export function ProfileDropdown() {
    const navigate = useNavigate();
    const [user] = useState<Payload | undefined>(getDecodedPayload());
    const [avatar, setAvatar] = useState<string>();

    async function fetchAvatar() {
        if (user?.avatarUrl) {
            const data = await getFirebaseThumbnail(user.avatarUrl, AVATAR_THUMBNAIL_HEIGHT)
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
            placement="bottom"
            >
            <DropdownTrigger>
                <Avatar className="[&_img]:opacity-100 cursor-pointer" src={avatar}/>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile dropdown menu">
                <DropdownSection showDivider title="Profile">
                    <DropdownItem key="user" textValue="User" href={`/user/${user?.id}`}>
                        <span className="block text-sm font-medium">{user?.username}</span>
                        {user?.role && <span className="block text-sm">{UserRoleMap[user.role]}</span>}
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection title="Quick actions">
                    <DropdownItem key="settings" href="/settings" startContent={<Cog6ToothIcon className="size-4"/>}>
                        Settings
                    </DropdownItem>
                    <DropdownItem key="logout" onPress={() => logout()} startContent={<ArrowLeftStartOnRectangleIcon className="size-4"/>}>
                        Logout
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}