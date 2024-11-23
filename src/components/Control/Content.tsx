import { Button, Tooltip } from "flowbite-react";
import { TextEditor } from "./TextEditor";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Content } from "../../models/content";
import { useEffect, useMemo, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { TextRenderer } from "./TextRenderer";
import { getDecodedPayload } from "../../helpers/jwt";
import { useStore } from "@nanostores/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { atom } from "nanostores";
import { useLocation } from "react-router-dom";
import { findImages } from "../../utils/json-content";
import { uploadImages } from "../../firebase/image";
import { $contentModalErrorMessage, $contentModalState, ContentModal, ContentModalErrorMessage } from "../Modal/Content";
import { toast } from "react-toastify";

const $editable = atom(false);

interface EditableContentProps {
    content: Content;
    onSave: (content: JSONContent) => void;
}

export function EditableContent(props: EditableContentProps) {
    const [editableContent, setEditableContent] = useState<JSONContent>();
    const editable = useStore($editable);

    async function processImages() {
        if (editableContent) {  
            const images = findImages(editableContent);
            try {
                const imageUrls = await uploadImages(images);
                images.forEach(image => {
                    if (image.attrs) {
                        image.attrs.src = imageUrls.shift();
                    }
                });
                setEditableContent(editableContent);
            } catch (e) {
                const em: ContentModalErrorMessage = "Failed to upload images";
                toast.error(em);
                $contentModalErrorMessage.set(em);
                $contentModalErrorMessage.set("Failed to upload images");
                throw e;
            }
        }
    }

    async function saveContent() {
        if (editableContent) {  
            $contentModalState.set("loading");        
            await processImages();
            props.onSave(editableContent);
            $editable.set(false);
        }
    }

    return (
        editable 
        ? <>
            <TextEditor text={editableContent} onChange={setEditableContent} />
            <Button color="secondary" className="mt-4 float-end" onClick={() => saveContent()}>
                <CheckIcon className="place-self-center inline size-4 mr-2"/> Save
            </Button>
            <ContentModal onRetry={saveContent}/>
        </>
        : <TextRenderer text={props.content.body} onAfterTextProcessed={setEditableContent} />
    )
}

interface ContentEditToggleProps {
    content: Content;
}

export function ContentEditToggle(props: ContentEditToggleProps) {
    const location = useLocation();
    const user = useMemo(() => getDecodedPayload(), []);
    const editable = useStore($editable);

    function handleToggle() {
        $editable.set(!editable);
    }

    useEffect(() => {
        $editable.set(false);
    }, [location]);

    if (user?.id !== props.content.author?._id) {
        return null;
    }

    return (
        <Tooltip content="Delete" placement="bottom">
            <button onClick={handleToggle} className={"hover:bg-black/10 rounded-full p-2" + (editable ? " text-secondary" : "")}>
                <PencilIcon className="size-6"/>
            </button>
        </Tooltip>
    )
}