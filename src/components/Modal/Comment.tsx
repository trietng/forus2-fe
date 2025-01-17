import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useStore } from "@nanostores/react";
import { Modal, Button, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { map } from "nanostores";
import { api } from "../../api";
import { ModalData, ModalMode } from "../../models/modal";
import { Comment } from "../../models/comment";

interface CommentModalData extends ModalData {
    comment: Omit<Comment, "body">;
}

const $commentModalData = map<CommentModalData>({open: false, comment: {}, mode: null});

interface CommmentModalProps {
    onRefresh?: () => void;
}

export function CommentModal(props: CommmentModalProps) {
    const commentModalData = useStore($commentModalData);

    async function handleDelete() {
        await api.delete(`/v1/comments/${commentModalData.comment._id}`);
        $commentModalData.setKey('open', false);
        if (props.onRefresh) {
            props.onRefresh();
        }
    }

    return (
        <Modal className="bg-forus-body-secondary"isOpen={commentModalData.open} size="md" onClose={() => $commentModalData.setKey('open', false)}>
            <ModalBody>
                <ModalContent>
                    <ModalHeader className="text-white">{commentModalData.keys?.header}</ModalHeader>
                    <ModalBody>
                        {commentModalData.mode === "delete" &&
                        <div className="text-center">
                            <ExclamationTriangleIcon className="mx-auto mb-4 size-14 text-yellow-400" />
                            <h3 className="mb-5 font-normal text-white">
                                Are you sure you want to delete this comment?
                            </h3>
                            <div className="flex justify-center gap-4">
                                <Button color="danger" onPress={() => handleDelete()}>
                                    Delete
                                </Button>
                                <Button onPress={() => $commentModalData.setKey('open', false)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>}
                    </ModalBody>
                </ModalContent>
            </ModalBody>
        </Modal>
    )
}

export async function openCommentModal(mode: ModalMode, comment: Comment) {
    $commentModalData.set({
        open: true,
        comment: comment,
        mode: mode
    });
}