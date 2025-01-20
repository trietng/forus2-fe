import { useMemo, useRef } from "react";
import { Button, Popover, PopoverContent, PopoverTrigger, Select, SelectItem } from "@heroui/react";
import { useStore } from "@nanostores/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon, ChevronDownIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { getDecodedPayload } from "../../helpers/jwt";
import { openBoxModal } from "../Modal/Box";
import { Group } from "../../models/group";
import { $box, Box } from "../../models/box";
import { api } from "../../api";

export function route(id: string, page: number, order: string | null = null, direction: string | null = null) {
    const url = isNaN(page) || page === 1 ? `/box/${id}` : `/box/${id}/${page}`;
    if (order && direction) {
        return `${url}?order=${order}&direction=${direction}`;
    }
    return url;
}

interface BoxCreatorProps {
    group?: Group;
    className?: string;
}

export function BoxCreator(props: BoxCreatorProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    if (user?.role !== "ROLE_ADMIN") return null;

    return (
        <Button color="primary" onPress={() => openBoxModal("create", props.group)} className={props.className}><PlusIcon className="size-4 place-self-center mr-2"/> Create box</Button>
    );
}

export function BoxEditor() {
    const user = useMemo(() => getDecodedPayload(), []);
    const box = useStore($box);

    if (user?.role !== "ROLE_ADMIN" && !box?.moderators?.includes(user?.id || '')) return null;

    return (
        <div className="grid grid-cols-3">
            <Button onPress={() => openBoxModal("edit", undefined, box)} className="w-full rounded-none text-white bg-blue-600 p-3 hover:brightness-105 text-[10px] text-ellipsis overflow-hidden"><PencilIcon className="size-3 place-self-center mr-2 inline"/> Edit</Button>
            {user?.role === "ROLE_ADMIN" && <Button onPress={() => openBoxModal("rename", undefined, box)} className="w-full rounded-none text-white bg-blue-600 p-3 hover:brightness-105 text-[10px] text-ellipsis overflow-hidden"><PencilIcon className="size-3 place-self-center mr-2 inline min-w-3"/> Rename</Button>}
            {user?.role === "ROLE_ADMIN" && <Button onPress={() => openBoxModal("delete", undefined, box)} className="w-full rounded-none text-white bg-red-500 p-3 hover:brightness-105 text-[10px] text-ellipsis overflow-hidden"><TrashIcon className="size-3 place-self-center mr-2 inline"/> Delete</Button>}
        </div>
    );
}

interface BoxSubscriberProps {
    className?: string;
    box: Box;
    onSubscribe: () => void;
}

export function BoxSubscriber(props: BoxSubscriberProps) {
    return (
        <Button color="secondary" className={props.className} onPress={() => props.onSubscribe()}>
            {props.box.subscriberStatus === true ? 
            <><XMarkIcon className="mr-2 inline min-w-3 size-3 place-self-center"/> Unsubscribe</> :
            <><ArrowPathRoundedSquareIcon className="mr-2 inline size-3 min-w-3 place-self-center"/> Subscribe</>}
        </Button>
    )
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

    if (!box) return null;

    return (
        <div className="bg-forus-primary rounded-lg overflow-hidden">
            <div className="p-4 border-b border-b-gray-400 font-bold">{box.name}</div>
            <div className="p-4 border-b border-b-gray-400">{box.description}</div>
            <div className="p-4 text-center">{box.subscriberCount} subscribers</div>
            <div className="flex md:flex-col md:w-full">
                <BoxSubscriber className="inline w-1/4 md:w-full rounded-none p-3 text-[10px] overflow-hidden" box={box} onSubscribe={subscribe} />
                <div className="w-3/4 md:w-full">
                    <BoxEditor />
                </div>
            </div>
        </div>
    );
}

interface ThreadFilterProps {
    order: string | null;
    direction: string | null;
    onApplyFilter: (order: string, direction: string) => void;
}

export function ThreadFilter(props: ThreadFilterProps) {
    const box = useStore($box);
    const orderRef = useRef<HTMLSelectElement>(null);
    const directionRef = useRef<HTMLSelectElement>(null);

    function applyFilter() {
        const order = orderRef.current?.value;
        const direction = directionRef.current?.value;
        if (box && box._id && order && direction) {
            props.onApplyFilter(order, direction);
        }
    }

    return (
        <Popover
            placement="bottom">
            <PopoverTrigger>
                <Button color="secondary" className="text-white">
                    <ChevronDownIcon className="size-4 place-self-center mr-2 inline"/>
                    Filter
                </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-forus-primary">
                <div className="p-3">
                    <label className="text-white" htmlFor="sortOption">Filter</label>
                    <div className="flex gap-3 mt-2" id="sortOption">
                        <Select className="min-w-40" id="sortOrder" ref={orderRef} defaultSelectedKeys={[props.order || "updatedAt"]}>
                            <SelectItem key="updatedAt">Updated at</SelectItem>
                            <SelectItem key="createdAt">Created at</SelectItem>
                            <SelectItem key="score">Score</SelectItem>
                            <SelectItem key="commentCount">Comment count</SelectItem>
                            <SelectItem key="title">Title</SelectItem>
                        </Select>
                        <Select className="min-w-40" id="sortDirection" ref={directionRef} defaultSelectedKeys={[props.direction || "desc"]}>
                            <SelectItem key="asc">Ascending</SelectItem>
                            <SelectItem key="desc">Descending</SelectItem>
                        </Select>
                    </div>
                    <Button color="secondary" onPress={applyFilter} className="text-white w-fit p-2 float-end my-3">Apply</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}