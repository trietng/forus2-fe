import { Key } from "react";
import { type Group } from "../../models/group";
import { GroupEditor } from "../Control/Group";
import { Link } from "react-router-dom";
import { BoxSubscriber } from "../Control/Box";

interface GroupProps {
    key: Key;
    group: Group;
}

export function GroupCard(props: GroupProps) {
    return (
        <div className={"mb-4 shadow-sm rounded-lg bg-white overflow-hidden"}>
            <div className="flex justify-between p-3 bg-primary items-center">
                <div className="font-bold text-lg">{props.group.name}</div>
                <GroupEditor group={props.group} />
            </div>
            <ul className="text-primary">
                {props.group.boxes!.map((box) => (
                    <li key={box._id} className="flex items-center justify-between p-3 border-b">
                        <Link to={`/box/${box._id}`} className="font-semibold hover:underline">{box.name}</Link>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col items-center justify-center">
                                <div>Threads</div>
                                <div>{box.threadCount}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div>Subscribers</div>
                                <div>{box.subscriberCount}</div>
                            </div>
                            <BoxSubscriber box={box} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}