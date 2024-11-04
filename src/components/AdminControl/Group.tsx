import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getDecodedPayload } from "../../helpers/jwt";
import { GROUP_NAME_MAX_LENGTH } from "../../constants/validation";
import { api } from "../../api";
import { $groups, Group } from "../../models/group";
import { map } from "nanostores";
import { useStore } from "@nanostores/react";
import { ExclamationTriangleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type ModalMode = 'create' | 'update' | 'delete' | null;

interface GroupModalData {
    open: boolean;
    keys?: {
        submitButton: string;
        header: string;
    }
    mode: ModalMode;
    group: Group;
}

const $groupModalData = map<GroupModalData>({open: false, group: {name: ''}, mode: null});

export function GroupModal() {
    const groupModalData = useStore($groupModalData);
    const groupNameInputRef = useRef<HTMLInputElement>(null);

    async function setGroupName(e: ChangeEvent<HTMLInputElement>) {
        $groupModalData.setKey('group', { ...groupModalData.group, name: e.target.value });
    }

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        switch (groupModalData.mode) {
            case 'create':
                const group = await api.post('/v1/groups', groupModalData.group);
                $groups.set([...($groups.get() || []), group.data]);
                break;
            case 'update':
                console.log(groupModalData.group);
                const updatedGroup = await api.put(`/v1/groups/${groupModalData.group._id}`, groupModalData.group);
                $groups.set($groups.get()!.map(group => group._id === updatedGroup.data._id ? updatedGroup.data : group));
                break;
        }
        $groupModalData.setKey('open', false);
    };

    async function handleDelete() {
        await api.delete(`/v1/groups/${groupModalData.group._id}`);
        $groups.set($groups.get()!.filter(group => group._id !== groupModalData.group._id));
        $groupModalData.setKey('open', false);
    }

    return (
        <Modal show={groupModalData.open} size="md" onClose={() => $groupModalData.setKey('open', false)} initialFocus={groupNameInputRef} popup={groupModalData.mode === "delete"}>
            <Modal.Header>{groupModalData.keys?.header}</Modal.Header>
            <Modal.Body>
                {groupModalData.mode === "delete" ?
                <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto mb-4 size-14 text-yellow-400" />
                    <h3 className="mb-5 font-normal text-white">
                        Are you sure you want to delete <span className="font-bold">{groupModalData.group.name}</span>?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure" onClick={() => handleDelete()}>
                            Delete
                        </Button>
                        <Button color="gray" onClick={() => $groupModalData.setKey('open', false)}>
                            Cancel
                        </Button>
                    </div>
                </div> : 
                <form id="createGroup" onSubmit={handleSubmit}>
                    <div className="flex justify-between text-white">
                        <Label htmlFor="groupName">Name</Label>
                        <span className="text-sm">{groupModalData.group.name.length || 0}/{GROUP_NAME_MAX_LENGTH}</span>
                    </div>
                    <TextInput type="text" id="groupName" className="mt-1" placeholder="Group name" onChange={setGroupName} ref={groupNameInputRef} maxLength={GROUP_NAME_MAX_LENGTH} value={groupModalData.group.name}/>
                </form>}
            </Modal.Body>
            {groupModalData.mode !== "delete" && 
            <Modal.Footer>
                <Button color="secondary" type="submit" form="createGroup">
                    {groupModalData.keys?.submitButton}
                </Button>
            </Modal.Footer>}
        </Modal>
    )
}

async function openModal(mode: ModalMode, group: Group = { name: '' }) {
    let keys;
    switch (mode) {
        case 'create':
            keys = { submitButton: 'Create', header: 'Create new group' };
            break;
        case 'update':
            keys = { submitButton: 'Update', header: 'Update group' };
            break;
    }
    $groupModalData.set({
        open: true,
        keys: keys,
        group: group,
        mode: mode
    });
}

export function GroupCreator() {
    const [user] = useState(getDecodedPayload());
    if (user?.role !== "ROLE_ADMIN") return null;

    return (
        <div
            className="rounded-lg shadow-sm mt-4 py-3 text-white text-center border-dashed border-4 hover:border-solid cursor-pointer"
            onClick={() => openModal("create")}
        >
            <PlusIcon className="size-8 place-self-center mr-2 inline"/><span className="text-lg">Create new group</span>
        </div>
    );
}

interface GroupEditorProps {
    group: Group;
}

export function GroupEditor(props: GroupEditorProps) {
    const [user] = useState(getDecodedPayload());
    if (user?.role !== "ROLE_ADMIN") return null;

    useEffect(() => {
        console.log(props.group);
    });

    return (
        <div className="flex gap-4">
            <Button color="blue" onClick={() => openModal("update", props.group)}><PencilIcon className="size-4 place-self-center mr-2"/> Edit</Button>
            <Button color="failure" onClick={() => openModal("delete", props.group)}><TrashIcon className="size-4 place-self-center mr-2"/> Delete</Button>
        </div>
    );
}