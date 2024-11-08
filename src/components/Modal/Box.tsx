import { map } from "nanostores";
import { Modal, Button, Label, TextInput, Textarea } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useStore } from "@nanostores/react";
import { ChangeEvent, useRef } from "react";
import { Box, BoxWithCount } from "../../models/box";
import { ModalData, ModalMode } from "../../models/modal";
import { $groups, Group } from "../../models/group";
import { api } from "../../api";
import { BOX_MAX_DESCRIPTION_LENGTH, BOX_MAX_NAME_LENGTH } from "../../constants/validation";

interface BoxModalData extends ModalData {
    box: Box;
    group?: Group;
}

export const $boxModalData = map<BoxModalData>({open: false, box: {name: '', description: ''}, mode: null});

export function BoxModal() {
    const boxModalData = useStore($boxModalData);
    const boxNameInputRef = useRef<HTMLInputElement>(null);

    async function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        $boxModalData.setKey('box', { ...boxModalData.box, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault();
        if (boxModalData.mode === "create") {
            let box: BoxWithCount = (await api.post(`v1/groups/${boxModalData.group?._id}/box`, boxModalData.box)).data;
            box.threadCount = 0;
            box.subscriberCount = 0;
            $groups.set($groups.get()!.map(group => group._id === boxModalData.group?._id ? {...group, boxes: [...group.boxes || [], box]} : group));
        } else {
            // Update box
        }
        $boxModalData.setKey('open', false);
    }

    return (
        <Modal show={boxModalData.open} size="md" onClose={() => $boxModalData.setKey('open', false)} initialFocus={boxNameInputRef} popup={boxModalData.mode === "delete"}>
            <Modal.Header>{boxModalData.keys?.header}</Modal.Header>
            <Modal.Body>
                {boxModalData.mode === "delete" ?
                <div className="text-center">
                    <ExclamationTriangleIcon className="mx-auto mb-4 size-14 text-yellow-400" />
                    <h3 className="mb-5 font-normal text-white">
                        Are you sure you want to delete <span className="font-bold">{boxModalData.box.name}</span>?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button color="failure">
                            Delete
                        </Button>
                        <Button color="gray" onClick={() => $boxModalData.setKey('open', false)}>
                            Cancel
                        </Button>
                    </div>
                </div> : 
                <form id="boxEditor" onSubmit={handleSubmit}>
                    <div className="flex justify-between text-white">
                        <Label htmlFor="boxName">Name</Label>
                        <span className="text-sm">{boxModalData.box.name.length || 0}/{BOX_MAX_NAME_LENGTH}</span>
                    </div>
                    <TextInput type="text" id="boxName" name="name" className="mt-1" placeholder="Box name" onChange={handleInputChange} ref={boxNameInputRef} value={boxModalData.box.name}/>
                    <div className="flex justify-between text-white mt-4">
                        <Label htmlFor="boxDescription">Description</Label>
                        <span className="text-sm">{boxModalData.box.description.length || 0}/{BOX_MAX_DESCRIPTION_LENGTH}</span>
                    </div>
                    <Textarea id="boxDescription" name="description" className="mt-1" placeholder="Box description" onChange={handleInputChange} value={boxModalData.box.description}/>
                </form>}
            </Modal.Body>
            {boxModalData.mode !== "delete" && 
            <Modal.Footer>
                <Button color="secondary" type="submit" form="boxEditor">
                    {boxModalData.keys?.submitButton}
                </Button>
            </Modal.Footer>}
        </Modal>
    )
}

export async function openBoxModal(mode: ModalMode, group?: Group, box: Box = {name: '', description: ''}) {
    let keys;
    switch (mode) {
        case "create":
            keys = {header: `Add new box to ${group?.name}`, submitButton: "Create"};
            break;
        case "update":
            keys = {header: "Update box", submitButton: "Update"};
            break;
    }
    $boxModalData.set({open: true, keys: keys, mode: mode, box: box, group: group});
}