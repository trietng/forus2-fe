import { Key } from "react";
import { type Group } from "../../models/group";
import { GroupEditor } from "../AdminControl/Group";

interface GroupProps {
    key: Key;
    group: Group;
}

export function GroupCard(props: GroupProps) {
    return (
        <div className={"mb-4 rounded-lg shadow-sm bg-white overflow-hidden" + (props.group.boxes!.length > 0 ? " rounded-b-none" : "")} key={props.key}>
            <div className="flex justify-between p-3 bg-primary items-center">
                <div className="font-bold text-lg">{props.group.name}</div>
                <GroupEditor group={props.group} />
            </div>
            <ul className="mb-0">
                {props.group.boxes!.map((box) => (
                    <div>{box.name}</div>
                ))}
            </ul>
        </div>
    );
}