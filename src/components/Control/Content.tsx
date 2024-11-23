import { Button, Tooltip } from "flowbite-react";
import { TextEditor } from "./TextEditor";
import { ArrowUturnLeftIcon, CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Content } from "../../models/content";
import { useEffect, useMemo, useState } from "react";
import { JSONContent } from "@tiptap/react";
import { TextRenderer } from "./TextRenderer";
import { getDecodedPayload } from "../../helpers/jwt";
import { useStore } from "@nanostores/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { atom } from "nanostores";
import { useLocation } from "react-router-dom";
import { findImages } from "../../utils/json-content";
import { uploadImages } from "../../firebase/image";
import { $contentModalErrorMessage, $contentModalState, ContentModal, ContentModalErrorMessage } from "../Modal/Content";
import { toast } from "react-toastify";
import { $box } from "../../models/box";

const $editableContentId = atom<string | undefined>();

interface EditableContentProps {
    content: Content;
    onSave: (content: JSONContent) => void;
}

export function EditableContent(props: EditableContentProps) {
    const [editableContent, setEditableContent] = useState<JSONContent>();
    const editable = useStore($editableContentId);

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
            $editableContentId.set(undefined);
        }
    }

    return (
        editable === props.content._id
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
    const editableContentId = useStore($editableContentId);

    function handleToggle() {
        if (editableContentId === props.content._id) {
            $editableContentId.set(undefined);
        } else {
            $editableContentId.set(props.content._id);
        }
    }

    useEffect(() => {
        $editableContentId.set(undefined);
    }, [location]);

    if (user?.id !== props.content.author?._id) {
        return null;
    }

    return (
        <Tooltip content="Edit" placement="bottom">
            <button onClick={handleToggle} className={"hover:bg-black/10 rounded-full p-2" + (editableContentId === props.content._id ? " text-secondary" : "")}>
                <PencilIcon className="size-6"/>
            </button>
        </Tooltip>
    )
}

interface VisibilityToggleProps {
    content: Content;
    onToggle: () => void;
}

export function VisibilityToggle(props: VisibilityToggleProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    const box = useStore($box);

    if (user?.role !== "ROLE_ADMIN" && !box?.moderators?.includes(user?.id || '')) return null;

    return (
        <Tooltip content="Show/hide" placement="bottom">
            <button onClick={props.onToggle} className={"hover:bg-black/10 rounded-full p-2" + (props.content.visibility === true ? " text-secondary" : "")}>
                <EyeIcon className="size-6"/>
            </button>
        </Tooltip>
    )
}

interface ContentDeleterProps {
    content: Content;
    onClick: () => void;
}

export function ContentDeleter(props: ContentDeleterProps) {
    const user = useMemo(() => getDecodedPayload(), []);
    const box = useStore($box);

    if (user?.role !== "ROLE_ADMIN" && !box?.moderators?.includes(user?.id || '')) return null;

    return (
        <Tooltip content="Delete" placement="bottom">
            <button onClick={props.onClick} className="hover:bg-black/10 rounded-full p-2 text-red-500">
                <TrashIcon className="size-6"/>
            </button>
        </Tooltip>
    );
}

interface ContentReplierProps {
    content: Content;
    onClick: () => void;
}

export function ContentReplier(props: ContentReplierProps) {
    return (
        <Tooltip content="Reply" placement="bottom">
            <button onClick={props.onClick} className="hover:bg-black/10 rounded-full p-2">
                <ArrowUturnLeftIcon className="size-6"/>
            </button>
        </Tooltip>
    );
}