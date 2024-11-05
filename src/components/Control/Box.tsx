import { useState } from "react";
import { Button, Dropdown } from "flowbite-react";
import { getDecodedPayload } from "../../helpers/jwt";
import { openBoxModal } from "../Modal/Box";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Group } from "../../models/group";
import { Box } from "../../models/box";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface BoxCreatorProps {
    group?: Group;
}

export function BoxCreator(props: BoxCreatorProps) {
    const [user] = useState(getDecodedPayload());
    if (user?.role !== "ROLE_ADMIN") return null;

    return (
        <Button color="blue" onClick={() => openBoxModal("create", props.group)}><PlusIcon className="size-4 place-self-center mr-2"/> Create box</Button>
    );
}

interface BoxStatusProps {
    box: Box;
}

export function BoxStatus(props: BoxStatusProps) {
    const [user] = useState(getDecodedPayload());
    if (user?.role !== "ROLE_ADMIN") return null;
    return (
        <Dropdown label={
            <div className="rounded-lg p-3 hover:shadow-md border" color={props.box.status === "approved" ? "success" : "warning"}>
                {props.box.status === "approved" ?
                <><CheckCircleIcon className="size-4 text-green-500 inline mr-2"/> Approved</>
                : (props.box.status === "rejected" ?
                <><XCircleIcon className="size-4 text-red-500 inline mr-2"/> Rejected</> :
                <div className="mx-3">Pending</div>)}
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