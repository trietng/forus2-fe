import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useStore } from "@nanostores/react";
import { Modal, Button, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { map } from "nanostores";
import { api } from "../../api";
import { ModalData, ModalMode } from "../../models/modal";
import { Thread } from "../../models/thread";
import { useNavigate } from "react-router-dom";

type AfterDeleteAction = "goback" | "refresh";

interface ThreadModalData extends ModalData {
    thread: Omit<Thread, "body" | "comments">;
    afterDeleteAction?: AfterDeleteAction;
}

const $threadModalData = map<ThreadModalData>({open: false, thread: { title: '' }, mode: null});

interface ThreadModalProps {
    onRefresh?: () => void;
}

export function ThreadModal(props: ThreadModalProps) {
    const navigate = useNavigate();
    const threadModalData = useStore($threadModalData);

    async function handleDelete() {
        await api.delete(`/v1/threads/${threadModalData.thread._id}`);
        $threadModalData.setKey('open', false);
        if (threadModalData.afterDeleteAction === "goback") {
            navigate(-1);
        } else if (threadModalData.afterDeleteAction === "refresh") {
            if (props.onRefresh) {
                props.onRefresh();
            }
        }
    }

    return (
        <Modal className="bg-forus-body-secondary" isOpen={threadModalData.open} size="md" onClose={() => $threadModalData.setKey('open', false)}>
            <ModalContent>
                <ModalHeader className="text-white">{threadModalData.keys?.header}</ModalHeader>
                <ModalBody>
                    {threadModalData.mode === "delete" &&
                    <div className="text-center">
                        <ExclamationTriangleIcon className="mx-auto mb-4 size-14 text-yellow-400" />
                        <h3 className="mb-5 font-normal text-white">
                            Are you sure you want to delete <span className="font-bold">{threadModalData.thread.title}</span>?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="danger" onPress={() => handleDelete()}>
                                Delete
                            </Button>
                            <Button onPress={() => $threadModalData.setKey('open', false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export async function openThreadModal(mode: ModalMode, thread: Thread, afterDeleteAction?: AfterDeleteAction) {
    $threadModalData.set({
        open: true,
        thread: thread,
        afterDeleteAction: afterDeleteAction,
        mode: mode
    });
}