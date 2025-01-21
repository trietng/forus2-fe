import { Key } from "react";
import { useStore } from "@nanostores/react";
import { $groups, type Group } from "../../models/group";
import { GroupEditor } from "../Control/Group";
import { BoxSubscriber } from "../Control/Box";
import { api } from "../../api";
import { ResponsiveLink } from "../ResponsiveLink";

interface GroupProps {
    key: Key;
    group: Group;
}

export function GroupCard(props: GroupProps) {
    const groups = useStore($groups);

    async function subscribe(id?: string) {
        const resp = await api.put(`v1/boxes/${id}/subscribe`);
        const subscriberStatus = resp.data.subscriberStatus;
        $groups.set(groups!.map((group) => {
            return {
                ...group,
                boxes: group.boxes!.map((box) => {
                    if (box._id === id) {
                        return {
                            ...box,
                            subscriberCount: box.subscriberCount! + (subscriberStatus === true ? 1 : -1),
                            subscriberStatus: !box.subscriberStatus,
                        }
                    }
                    return box;
                })
            }
        }));
    }

    return (
        <div className={"mb-4 shadow-sm rounded-lg bg-white overflow-hidden"} id={props.group._id}>
            <div className="flex flex-col md:flex-row justify-between gap-3 p-3 bg-forus-primary items-center">
                <div className="font-bold text-lg">{props.group.name}</div>
                <GroupEditor group={props.group} />
            </div>
            <ul className="text-forus-primary">
                {props.group.boxes!.map((box) => (
                    <li key={box._id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b">
                        <ResponsiveLink href={`/box/${box._id}`} className="border-forus-primary text-forus-primary">{box.name}</ResponsiveLink>
                        <div className="-mx-3 my-2 md:hidden"/>
                        <div className="flex gap-4 items-center justify-evenly">
                            <div className="flex flex-col items-center justify-center">
                                <div>Threads</div>
                                <div>{box.threadCount}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div>Subscribers</div>
                                <div>{box.subscriberCount}</div>
                            </div>
                            <BoxSubscriber className="w-32" box={box} onSubscribe={() => subscribe(box._id)}/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}