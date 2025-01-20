import { Key } from "react";
import { type Group } from "../../models/group";
import { GroupEditor } from "../Control/Group";
import { Link, useNavigate } from "react-router-dom";
import { BoxSubscriber } from "../Control/Box";
import { Button } from "@heroui/react";

interface GroupProps {
    key: Key;
    group: Group;
}

export function GroupCard(props: GroupProps) {
    const navigate = useNavigate();

    return (
        <div className={"mb-4 shadow-sm rounded-lg bg-white overflow-hidden"} id={props.group._id}>
            <div className="flex flex-col md:flex-row justify-between gap-3 p-3 bg-forus-primary items-center">
                <div className="font-bold text-lg">{props.group.name}</div>
                <GroupEditor group={props.group} />
            </div>
            <ul className="text-forus-primary">
                {props.group.boxes!.map((box) => (
                    <li key={box._id} className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b">
                        <Link to={`/box/${box._id}`} className="font-semibold hover:underline hidden md:block">{box.name}</Link>
                        <Button variant="ghost" className="border-forus-primary text-forus-primary font-semibold text-medium justify-start md:hidden" onPress={() => navigate(`/box/${box._id}`)}>{box.name}</Button>
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
                            <BoxSubscriber box={box} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}