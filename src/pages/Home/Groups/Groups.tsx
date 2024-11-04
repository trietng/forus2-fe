import { useEffect } from "react";
import { api } from "../../../api";
import { $groups } from "../../../models/group";
import { GroupCard } from "../../../components/GroupCard/GroupCard";
import { FallbackSpinner } from "../../../components/FallbackSpinner";
import { GroupCreator, GroupModal } from "../../../components/AdminControl/Group";
import { useStore } from "@nanostores/react";

export function Groups() {
    const groups = useStore($groups);

    async function fetchGroups() {
        // Fetch groups
        const response = await api.get("v1/groups");
        $groups.set(response.data);
    }

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <>
            {groups ? (groups.length === 0 ?
            <div className="text-center">No groups found.</div> :
            groups.map((group) => (
                <GroupCard key={group._id!} group={group} />
            ))) : <FallbackSpinner />}
            <GroupCreator/>
            <GroupModal />
        </>
        
    );
}