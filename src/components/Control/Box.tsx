import { useMemo } from "react";
import { Button, Dropdown } from "flowbite-react";
import { useStore } from "@nanostores/react";
import { CheckCircleIcon, ClockIcon, PencilIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getDecodedPayload } from "../../helpers/jwt";
import { openBoxModal } from "../Modal/Box";
import { Group } from "../../models/group";
import { $box, Box } from "../../models/box";
import { api } from "../../api";

interface BoxCreatorProps {
    group?: Group;
}

export function BoxCreator(props: BoxCreatorProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    if (user?.role !== "ROLE_ADMIN") return null;

    return (
        <Button color="blue" onClick={() => openBoxModal("create", props.group)}><PlusIcon className="size-4 place-self-center mr-2"/> Create box</Button>
    );
}

interface BoxSubscriberProps {
    box: Box;
}

export function BoxSubscriber(props: BoxSubscriberProps) {
    async function subscribe() {
        await api.put(`v1/box/${props.box._id}/subscribe`);
    }

    return (
        <Button color="secondary" onClick={() => subscribe()}><ArrowPathRoundedSquareIcon className="mr-2 inline size-4 place-self-center"/>Subscribe</Button>
    );
}

export function ContentStatus(props: any) {
    const user = useMemo(() => getDecodedPayload(), []);
    if (user?.role !== "ROLE_ADMIN") return null;
    return (
        <Dropdown 
            label={
                <div className="rounded-lg p-3 hover:shadow-md border" color={props.box.status === "approved" ? "success" : "warning"}>
                    {props.box.status === "approved" ?
                    <><CheckCircleIcon className="size-4 text-green-500 inline mr-2"/> Approved</>
                    : (props.box.status === "rejected" ?
                    <><XCircleIcon className="size-4 text-red-500 inline mr-2"/> Rejected</> :
                    <><ClockIcon className="size-4 text-blue-500 inline mr-2"/> Pending</>)}
                </div>
            } 
            arrowIcon={false}
            inline
            placement="bottom-end"
        >
            <Dropdown.Item><CheckCircleIcon className="size-4 text-green-500 inline mr-2"/> Approve</Dropdown.Item>
            <Dropdown.Item><XCircleIcon className="size-4 text-red-500 inline mr-2"/> Reject</Dropdown.Item>
        </Dropdown>
    );
}

export function BoxEditor() {
    const user = useMemo(() => getDecodedPayload(), []);
    const box = useStore($box);

    if (user?.role !== "ROLE_ADMIN" && !box?.moderators?.includes(user?.id || '')) return null;

    return (
        <div className="flex">
            <button onClick={() => openBoxModal("edit", undefined, box)} className="w-full bg-blue-600 p-3 hover:brightness-105 text-[10px] overflow-hidden"><PencilIcon className="size-3 place-self-center mr-2 inline"/> Edit</button>
            {user?.role === "ROLE_ADMIN" && <button onClick={() => openBoxModal("rename", undefined, box)} className="w-full bg-blue-600 p-3 hover:brightness-105 text-[10px] overflow-hidden"><PencilIcon className="size-3 place-self-center mr-2 inline"/> Rename</button>}
            {user?.role === "ROLE_ADMIN" && <button onClick={() => openBoxModal("delete", undefined, box)} className="w-full bg-red-500 p-3 hover:brightness-105 text-[10px] overflow-hidden"><TrashIcon className="size-3 place-self-center mr-2 inline"/> Delete</button>}
        </div>
    );
}

export function BoxInformation() {
    const box = useStore($box);

    async function subscribe() {
        const response = await api.put(`v1/boxes/${box?._id}/subscribe`);
        $box.set({
            ...$box.get()!,
            subscriberCount: $box.get()!.subscriberCount! + (response.data.subscriberStatus === true ? 1 : -1),
            subscriberStatus: response.data.subscriberStatus,
        });
    }

    return (
        <div className="bg-primary rounded-lg overflow-hidden">
            <div className="p-4 border-b border-b-gray-400 font-bold">{box?.name}</div>
            <div className="p-4 border-b">{box?.description}</div>
            <div className="p-4 text-center">{box?.subscriberCount} subscribers</div>
            <div className="flex md:flex-col md:w-full">
                <button className="inline w-1/4 md:w-full bg-secondary p-3 hover:brightness-105 text-[10px] overflow-hidden" onClick={() => subscribe()}>
                    {box?.subscriberStatus === true ? 
                    <><XMarkIcon className="mr-2 inline size-3 place-self-center"/> Unsubscribe</> :
                    <><ArrowPathRoundedSquareIcon className="mr-2 inline size-3 place-self-center"/> Subscribe</>}
                </button>
                <div className="w-3/4 md:w-full">
                    <BoxEditor />
                </div>
            </div>
        </div>
    );
}