import { PlusIcon } from "@heroicons/react/24/outline";
import { $contentModalErrorMessage, $contentModalState, ContentModal, ContentModalErrorMessage } from "../Modal/Content";
import { Button } from "flowbite-react";
import { api } from "../../api";
import { FormEvent, useState } from "react";
import { TextEditor } from "./TextEditor";
import { toast } from "react-toastify";
import { findImages } from "../../utils/json-content";
import { JSONContent } from "@tiptap/react";
import { uploadImages } from "../../firebase/image";
import { Thread } from "../../models/thread";
import { TextRenderer } from "./TextRenderer";
import { Comment } from "../../models/comment";
import { XMarkIcon } from "@heroicons/react/24/solid";

type ReplyMode = "reply" | "create";

interface ReplyProps {
    reply: Comment;
    onClearReply?: () => void;
    mode?: ReplyMode;
}

export function Reply(props: ReplyProps) {
    return (
        <div className={"justify-between rounded-lg overflow-hidden bg-body-secondary" + (props.mode === "reply" ? " border border-primary" : "")}>
            <div className="flex justify-between items-center bg-primary p-4">
                <span className="font-bold">{props.reply.author && props.reply.author.displayName} {' '} said:</span>
                {props.mode !== "reply" && <Button color="failure" onClick={() => {
                    if (props.onClearReply) {
                        props.onClearReply();
                    }
                }}>
                    <XMarkIcon className="place-self-center inline size-4 mr-2"/> Cancel
                </Button>}
            </div>
            <div className="p-4">
                <TextRenderer text={props.reply.body} />
            </div>
        </div>
    )
}

interface CommentCreatorProps {
    reply?: Comment;
    onClearReply?: () => void;
    thread: Thread;
    onCommentCreated: () => void;
}

export function CommentCreator(props: CommentCreatorProps) {
    const [content, setContent] = useState<JSONContent>();

    async function processImages(content: JSONContent) {
        const images = findImages(content);
        try {
            const imageUrls = await uploadImages(images);
            images.forEach(image => {
                if (image.attrs) {
                    image.attrs.src = imageUrls.shift();
                }
            });
            setContent(content);
        } catch (e) {
            const em: ContentModalErrorMessage = "Failed to upload images";
            toast.error(em);
            $contentModalErrorMessage.set(em);
            $contentModalState.set("error");
            throw e;
        }
    }

    async function createComment(e?: FormEvent<HTMLFormElement>) {
        if (e) {
            e.preventDefault();
        }
        if (content) {
            $contentModalState.set("loading");
            // Find any base64 images in the content and upload them to firebase
            // TODO: Remote CRON job to delete old images
            await processImages(content);
            // Create the thread
            try {
                await api.post(`/v1/threads/${props.thread?._id}/comment`, {
                    body: JSON.stringify(content),
                    replyTo: props.reply?._id
                });
                $contentModalState.set("idle");
                // Refresh the current page
                props.onCommentCreated();
            } catch (_) {
                const em: ContentModalErrorMessage = "Failed to save content";
                $contentModalErrorMessage.set(em);
                $contentModalState.set("error");
            }
        } else {
            toast.error("Content is empty");
        }
    }

    return (
        <form noValidate onSubmit={createComment}>
            {props.reply && <div className="mb-4">
                <Reply reply={props.reply} onClearReply={() => {
                    if (props.onClearReply) {
                        props.onClearReply();
                    }
                }} />
            </div>}
            <TextEditor onChange={setContent}/>
            <Button color="secondary" className="mt-4 float-end" type="submit">
                <PlusIcon className="place-self-center inline size-4 mr-2"/> Add comment
            </Button>
            <ContentModal onRetry={createComment}/>
        </form>
    )
}