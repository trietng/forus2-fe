import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { api } from "../../../api";
import { $groups } from "../../../models/group";
import { GroupCard } from "../../../components/GroupCard";
import { FallbackSpinner } from "../../../components/FallbackSpinner";
import { GroupModal } from "../../../components/Modal/Group";
import { GroupCreator } from "../../../components/Control/Group";
import { BoxModal } from "../../../components/Modal/Box";

export function Groups() {
    const location = useLocation();
    const groups = useStore($groups);

    async function fetchGroups() {
        // Fetch groups
        const response = await api.get("v1/groups");
        $groups.set(response.data);
    }

    useEffect(() => {
        fetchGroups().then(() => {
            // scroll to hash
            if (location.hash) {
                const element = document.getElementById(location.hash.slice(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        })
    }, [location.key]);

    return (
        <>
            {groups ? (groups.length === 0 ?
            <div className="text-center">No groups found.</div> :
            groups.map((group) => (
                <GroupCard group={group} key={group._id!}/>
            ))) : <FallbackSpinner />}
            <GroupCreator />
            <GroupModal />
            <BoxModal />
        </>
        
    );
}