import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <DropdownMenu>
                <DropdownSection>
                    <DropdownItem key="profile" showDivider>
                        <span className="block text-sm font-medium">{user?.username}</span>
                        {user?.role && <span className="block text-sm">{UserRoleMap[user.role]}</span>}
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection>
                    <DropdownItem key="settings">
                        <Link to="/settings"><Cog6ToothIcon className="mr-2 inline size-4"/> Settings</Link>
                    </DropdownItem>
                    <DropdownItem key="logout" onPress={() => logout()}>
                        <ArrowLeftStartOnRectangleIcon className="mr-2 inline size-4"/> Logout
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
}