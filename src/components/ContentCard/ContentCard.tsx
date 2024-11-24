import { Avatar, Card } from "flowbite-react";
import { Content } from "../../models/content";
import { ReactNode, useEffect, useState } from "react";
import { getImage } from "../../firebase/image";
import { UserRoleMap } from "../../models/role";
import { Link } from "react-router-dom";
import { EditableContent } from "../Control/Content";
import { JSONContent } from "@tiptap/react";

interface ContentCardProps {
    content: Content;
    informationSlot?: ReactNode;
    controlSlot?: ReactNode;
    beforeSlot?: ReactNode;
    afterSlot?: ReactNode;
    onSaveContent?: (body: JSONContent) => void;
    hideUserInformation?: boolean;
    showLinkToThread?: boolean;
}

export function ContentCard(props: ContentCardProps) {
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
        <div className="flex flex-col md:flex-row content-card" id={props.content._id}>
            {props.hideUserInformation !== true && <Card className="hidden md:flex bg-primary border-none rounded-e-none min-w-36">
                <div className="place-self-start h-full text-center">
                    <Avatar size="lg" img={avatarUrl}/>
                    <Link className="text-sm font-medium mt-1 hover:underline" to={`/user/${props.content.author?._id}`}>{props.content.author?.displayName}</Link>
                    {props.content.author?.role && <span className="block text-sm">{UserRoleMap[props.content.author?.role]}</span>}
                </div>
            </Card>}
            <Card className={"bg-body-secondary border-none w-full" + (props.hideUserInformation ? " rounded-lg" : " rounded-b-none md:rounded-br-lg md:rounded-tl-none")}>
                <div className="flex flex-col w-full justify-between">
                    <div>
                        {props.content.title && (
                            props.showLinkToThread ?
                            <Link to={`/thread/${props.content._id}`} className="text-2xl font-semibold hover:underline">{props.content.title}</Link> :
                            <div className="text-2xl font-semibold">{props.content.title}</div>
                        )}
                        <div className="text-sm my-2">
                            {props.beforeSlot}
                            <EditableContent content={props.content} onSave={(content) => {
                                if (props.onSaveContent) {
                                    props.onSaveContent(content);
                                }
                            }}/>
                            {props.afterSlot}
                        </div>
                    </div>
                    <div className="py-2 ms-2 md:flex justify-stretch items-center gap-4 hidden">
                        {props.informationSlot}
                        {props.controlSlot}
                    </div>
                </div>
            </Card>
            {props.hideUserInformation !== true && <Card className="md:hidden bg-primary border-none rounded-t-none">
                <div className="flex">
                    <div className="text-center">
                        <Avatar size="lg" img={avatarUrl}/>
                        <Link className="text-sm font-medium mt-1 hover:underline" to={`/user/${props.content.author?._id}`}>{props.content.author?.displayName}</Link>
                        {props.content.author?.role && <span className="block text-sm">{UserRoleMap[props.content.author?.role]}</span>}
                    </div>
                    <div className="ms-4 flex flex-col gap-4">
                        <div className="flex gap-4">
                            {props.informationSlot}
                        </div>
                        <div className="flex gap-4">
                            {props.controlSlot}
                        </div>
                    </div>
                </div>
            </Card>}
        </div>
    );
}