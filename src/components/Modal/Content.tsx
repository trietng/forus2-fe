import { ExclamationCircleIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Modal, Button, ModalContent, ModalBody } from "@heroui/react";
import { BlinkingDots } from "../BlinkingDots";
import { atom } from "nanostores";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export type ContentModalState = "idle" | "loading" | "error";
export type ContentModalErrorMessage = "Failed to save content" | "Failed to upload images" | "Failed to save comment" | "Failed to save thread";

export const $contentModalState = atom<ContentModalState>("idle");
export const $contentModalErrorMessage = atom<ContentModalErrorMessage>("Failed to save content")

interface ContentModalProps {
    onRetry: () => void;
}

export function ContentModal(props: ContentModalProps) {
    const location = useLocation();
    const contentModalState = useStore($contentModalState);
    const contentModalErrorMessage = useStore($contentModalErrorMessage);

    useEffect(() => {
        $contentModalState.set("idle");
    }, [location]);

    return (
        <Modal className="bg-forus-body-secondary"isOpen={contentModalState !== "idle"} size="md">
            <ModalContent>
                <ModalBody>
                    <div className="m-4 flex flex-col justify-center items-center text-white">
                        {contentModalState === "loading" ?
                        <>
                            {/* <Spinner color="secondary" className="size-8 mb-2"/> */}
                            <div>Saving content <BlinkingDots/></div> 
                        </> :
                        <>
                            <ExclamationCircleIcon className="size-8 mb-2 text-red-500"/>
                            <div className="mb-2">{contentModalErrorMessage}</div>
                            <div className="flex gap-4">
                                <Button color="secondary" onPress={props.onRetry}><ArrowPathIcon className="size-4 mr-2 place-self-center"/> Retry</Button>
                                <Button onPress={() => $contentModalState.set("idle")}><XMarkIcon className="size-4 mr-2 place-self-center"/>  Cancel</Button>
                            </div>
                        </>}
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}