import { Button, Modal, Spinner, TextInput } from "flowbite-react";
import { $content, ContentEditorMode, TextEditor } from "./TextEditor/TextEditor";
import { THREAD_MAX_TITLE_LENGTH } from "../../constants/validation";
import { useStore } from "@nanostores/react";
import { ArrowPathIcon, CheckIcon, ExclamationCircleIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BlinkingDots } from "../BlinkingDots";
import { atom } from "nanostores";
import { useState } from "react";
import { findImages } from "../../utils/json-content";
import { uploadImages } from "../../firebase/image";
import { toast } from "react-toastify";
import { api } from "../../api";
import { JSONContent } from "@tiptap/react";
import { $box } from "../../models/box";
import { useNavigate } from "react-router-dom";

interface ThreadEditorProps {
    mode: ContentEditorMode;
}

type ThreadEditorState = "idle" | "loading" | "error";
type ThreadEditorErrorMessages = "Failed to save thread" | "Failed to upload images";

const $title = atom<string>('');

export function ThreadEditor(props: ThreadEditorProps) {
    const navigate = useNavigate();
    const box = useStore($box);
    const content = useStore($content);
    const title = useStore($title);
    const [modalStatus, setModalStatus] = useState<ThreadEditorState>("idle");
    const [errorMessage, setErrorMessage] = useState<ThreadEditorErrorMessages>("Failed to save thread");

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        $title.set(e.target.value);
    }

    async function processImages(content: JSONContent) {
        const images = findImages(content);
        try {
            const imageUrls = await uploadImages(images);
            images.forEach(image => {
                if (image.attrs) {
                    image.attrs.src = imageUrls.shift();
                }
            });
            $content.set(content);
        } catch (_) {
            const em: ThreadEditorErrorMessages = "Failed to upload images";
            toast.error(em);
            setErrorMessage(em);
            setModalStatus("error");
        }
    }

    async function saveThread() {
        
    }

    async function createThread() {
        if (content) {
            // Find any base64 images in the content and upload them to firebase
            // TODO: Remote CRON job to delete old images
            await processImages(content);
            // Create the thread
            try {
                await api.post(`/v1/boxes/${box?._id}/thread`, { 
                    title: title,
                    body: JSON.stringify(content),
                });
                setModalStatus("idle");
                // Refresh the current page
                navigate(0);
            } catch (_) {
                const em: ThreadEditorErrorMessages = "Failed to save thread";
                setErrorMessage(em);
                setModalStatus("error");
            }
        }
    }

    async function submitThread() {
        setModalStatus("loading");
        if (props.mode === "create") {
            await createThread();
        } else {
            await saveThread();
        }
    }

    return (
        <>
            {props.mode === "create" && 
                <div className="flex">
                    <TextInput color="primary" className="[&_input]:rounded-e-none w-full" maxLength={THREAD_MAX_TITLE_LENGTH} onChange={handleTitleChange} value={title} placeholder="Title"/>
                    <div className="bg-primary rounded-r-lg p-2 border-s text-sm text-center">
                        {title.length}/{THREAD_MAX_TITLE_LENGTH}
                    </div>
                </div>
            }
            <TextEditor />
            <Button color="secondary" className="mt-4 float-end" onClick={() => submitThread()}>{
                props.mode === "create" ?
                <><PlusIcon className="place-self-center inline size-4 mr-2"/> Create</> :
                <><CheckIcon className="place-self-center inline size-4 mr-2"/> Save</>
            }
            </Button>
            <Modal popup show={modalStatus !== "idle"} size="md">
                <Modal.Body className="p-0">
                    <div className="m-4 flex flex-col justify-center items-center text-white">
                        {modalStatus === "loading" ?
                        <>
                            <Spinner color="secondary" className="size-8 mb-2"/>
                            {props.mode === "create" ? 
                            <div>Creating thread <BlinkingDots/></div> : 
                            <div>Saving thread <BlinkingDots/></div>}
                        </> :
                        <>
                            <ExclamationCircleIcon className="size-8 mb-2 text-red-500"/>
                            <div className="mb-2">{errorMessage}</div>
                            <div className="flex gap-4">
                                <Button color="secondary" onClick={() => submitThread()}><ArrowPathIcon className="size-4 mr-2 place-self-center"/> Retry</Button>
                                <Button color="gray" onClick={() => setModalStatus("idle")}><XMarkIcon className="size-4 mr-2 place-self-center"/>  Cancel</Button>
                            </div>
                        </>}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}