import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useStore } from "@nanostores/react";
import { Modal, Button, Input, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { map } from "nanostores";
import { useRef, ChangeEvent } from "react";
import { api } from "../../api";
import { GROUP_NAME_MAX_LENGTH } from "../../constants/validation";
import { Group, $groups } from "../../models/group";
import { ModalData, ModalMode } from "../../models/modal";


interface GroupModalData extends ModalData {
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
            case "create":
                const group = await api.post('/v1/groups', groupModalData.group);
                $groups.set([...($groups.get() || []), group.data]);
                break;
            case "update":
                const updatedGroup = await api.put(`/v1/groups/${groupModalData.group._id}`, groupModalData.group);
                console.log(updatedGroup);
                $groups.set($groups.get()!.map(group => {
                    if (group._id === updatedGroup.data._id) {
                        group.name = updatedGroup.data.name;
                    }
                    return group;
                }));
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
        <Modal className="bg-forus-body-secondary"isOpen={groupModalData.open} size="md" onClose={() => $groupModalData.setKey('open', false)}>
            <ModalContent>
                <ModalHeader className="text-white">{groupModalData.keys?.header}</ModalHeader>
                <ModalBody>
                    {groupModalData.mode === "delete" ?
                    <div className="text-center">
                        <ExclamationTriangleIcon className="mx-auto mb-4 size-14 text-yellow-400" />
                        <h3 className="mb-5 font-normal text-white">
                            Are you sure you want to delete <span className="font-bold">{groupModalData.group.name}</span>?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="danger" onPress={() => handleDelete()}>
                                Delete
                            </Button>
                            <Button onPress={() => $groupModalData.setKey('open', false)}>
                                Cancel
                            </Button>
                        </div>
                    </div> : 
                    <form id="groupEditor" onSubmit={handleSubmit}>
                        <div className="flex justify-between text-white">
                            <label htmlFor="groupName">Name</label>
                            <span className="text-sm">{groupModalData.group.name.length || 0}/{GROUP_NAME_MAX_LENGTH}</span>
                        </div>
                        <Input type="text" id="groupName" className="mt-1" placeholder="Group name" onChange={setGroupName} ref={groupNameInputRef} maxLength={GROUP_NAME_MAX_LENGTH} value={groupModalData.group.name}/>
                    </form>}
                </ModalBody>
                {groupModalData.mode !== "delete" &&
                <ModalFooter>
                    <Button color="secondary" type="submit" form="groupEditor">
                        {groupModalData.keys?.submitButton}
                    </Button>
                </ModalFooter>}
            </ModalContent>
        </Modal>
    )
}

export async function openGroupModal(mode: ModalMode, group: Group = { name: '' }) {
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