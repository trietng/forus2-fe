import { Avatar, Card } from "flowbite-react";
import { Content } from "../../models/content";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { getImage } from "../../firebase/image";
import { getDecodedPayload } from "../../helpers/jwt";
import { UserRoleMap } from "../../models/role";
import { Link } from "react-router-dom";
import { EditableContent } from "../Control/Content";

interface ContentCardProps {
    content: Content;
    informationSlot: ReactNode;
}

export function ContentCard(props: ContentCardProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    const [avatarUrl, setAvatarUrl] = useState<string>();

    async function renderAvatar() {
        if (props.content.author) {
            const image = await getImage(props.content.author.avatarUrl);
            setAvatarUrl(image);
        }
    }
    
    useEffect(() => {
        renderAvatar();
    }, []);

    return (
        <div className="flex flex-col md:flex-row">
            <Card className="hidden md:flex bg-primary border-none rounded-e-none min-w-36">
                <div className="place-self-start h-full text-center">
                    <Avatar size="lg" img={avatarUrl}/>
                    <Link className="text-sm font-medium mt-1 hover:underline" to={`/user/${props.content.author?._id}`}>{props.content.author?.displayName}</Link>
                    {props.content.author?.role && <span className="block text-sm">{UserRoleMap[props.content.author?.role]}</span>}
                </div>
            </Card>
            <Card className="bg-body-secondary border-none w-full rounded-b-none md:rounded-br-lg md:rounded-tl-none">
                <div className="flex flex-col w-full justify-between">
                    <div>
                        <div className="text-2xl font-semibold">{props.content.title}</div>
                        <div className="text-sm my-2">
                            <EditableContent content={props.content}/>
                        </div>
                    </div>
                    <div className="py-2 ms-2 md:flex justify-stretch items-center gap-4 hidden">
                        
                        {props.informationSlot}
                    </div>
                </div>
            </Card>
            <Card className="md:hidden bg-primary border-none rounded-t-none">
                <div className="flex">
                    <div className="text-center">
                        <Avatar size="lg" img={avatarUrl}/>
                        <Link className="text-sm font-medium mt-1 hover:underline" to={`/user/${props.content.author?._id}`}>{props.content.author?.displayName}</Link>
                        {props.content.author?.role && <span className="block text-sm">{UserRoleMap[props.content.author?.role]}</span>}
                    </div>
                    <div className="ms-2 flex flex-col justify-stretch items-center gap-4">
                        <div className="flex gap-4">
                            {props.informationSlot}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}