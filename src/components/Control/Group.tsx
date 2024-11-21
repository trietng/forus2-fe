import { useMemo } from "react";
import { Button } from "flowbite-react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getDecodedPayload } from "../../helpers/jwt";
import { Group } from "../../models/group";
import { openGroupModal } from "../Modal/Group";
import { BoxCreator } from "./Box";

export function GroupCreator() {
    const user = useMemo(() => getDecodedPayload(), []);
    if (user?.role !== "ROLE_ADMIN") return null;

    return (
        <div
            className="rounded-lg shadow-sm mt-4 py-3 text-white text-center border-dashed border-4 hover:border-solid cursor-pointer"
            onClick={() => openGroupModal("create")}
        >
            <PlusIcon className="size-8 place-self-center mr-2 inline"/><span className="text-lg">Create new group</span>
        </div>
    );
}

interface GroupEditorProps {
    group: Group;
}

export function GroupEditor(props: GroupEditorProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    if (user?.role !== "ROLE_ADMIN") return null;
    return (
        <div className="flex items-center">
            <BoxCreator group={props.group} className="rounded-e-none"/>
            <Button color="blue" onClick={() => openGroupModal("update", props.group)} className="rounded-s-none rounded-e-none"><PencilIcon className="size-4 place-self-center mr-2"/> Edit</Button>
            <Button color="failure" onClick={() => openGroupModal("delete", props.group)} className="rounded-s-none"><TrashIcon className="size-4 place-self-center mr-2"/> Delete</Button>
        </div>
    );
}