import { useMemo } from "react";
import { Button, Dropdown } from "flowbite-react";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getDecodedPayload } from "../../helpers/jwt";
import { openBoxModal } from "../Modal/Box";
import { Group } from "../../models/group";
import { Box } from "../../models/box";
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