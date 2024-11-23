import { Avatar, Button, Modal, Spinner, TextInput, Tooltip } from "flowbite-react";
import { TextEditor } from "./TextEditor/TextEditor";
import { THREAD_MAX_TITLE_LENGTH } from "../../constants/validation";
import { useStore } from "@nanostores/react";
import { ArrowPathIcon, ExclamationCircleIcon, EyeIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BlinkingDots } from "../BlinkingDots";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { findImages } from "../../utils/json-content";
import { uploadImages } from "../../firebase/image";
import { toast } from "react-toastify";
import { api } from "../../api";
import { JSONContent } from "@tiptap/react";
import { $box } from "../../models/box";
import { Link, useNavigate } from "react-router-dom";
import { Thread } from "../../models/thread";
import { getTimePassed } from "../../utils/datetime";
import { VoteAction, Voter } from "../Voter/Voter";
import { getFirebaseThumbnail } from "../../firebase/thumbnail";
import { AVATAR_THUMBNAIL_HEIGHT } from "../../constants/thumbnail";
import { getDecodedPayload } from "../../helpers/jwt";
import { Content } from "../../models/content";
import { FormValidationData } from "../../models/form-validation-data";
import { ValidationMessage } from "../Validation/ValidationMessage";

type ThreadCreatorState = "idle" | "loading" | "error";
type ThreadCreatorErrorMessages = "Failed to save thread" | "Failed to upload images";

export function ThreadCreator() {
    const navigate = useNavigate();
    const box = useStore($box);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<JSONContent>();
    const [titleValidation, setTitleValidation] = useState<FormValidationData>({ status: true, message: '' });
    const [modalStatus, setModalStatus] = useState<ThreadCreatorState>("idle");
    const [errorMessage, setErrorMessage] = useState<ThreadCreatorErrorMessages>("Failed to save thread");

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value);
        setTitleValidation({ status: e.target.validity.valid, message: e.target.validationMessage });
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
            setContent(content);
        } catch (e) {
            const em: ThreadCreatorErrorMessages = "Failed to upload images";
            toast.error(em);
            setErrorMessage(em);
            setModalStatus("error");
            throw e;
        }
    }

    async function createThread(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!titleValidation.status) {
            toast.error(`Title: ${titleValidation.message}`);
            return;
        }
        setModalStatus("loading");
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
                const em: ThreadCreatorErrorMessages = "Failed to save thread";
                setErrorMessage(em);
                setModalStatus("error");
            }
        }
    }

    return (
        <form noValidate onSubmit={createThread}>
            <div className="flex">
                <TextInput color="primary" className="[&_input]:rounded-e-none w-full" maxLength={THREAD_MAX_TITLE_LENGTH} onChange={handleTitleChange} required placeholder="Title"/>
                <div className="bg-primary rounded-r-lg p-2 border-s text-sm text-center">
                    {title.length}/{THREAD_MAX_TITLE_LENGTH}
                </div>
            </div>
            <ValidationMessage formValidationData={titleValidation} className="my-1"/>
            <TextEditor onChange={setContent}/>
            <Button color="secondary" className="mt-4 float-end" type="submit">
                <PlusIcon className="place-self-center inline size-4 mr-2"/> Create
            </Button>
            <Modal popup show={modalStatus !== "idle"} size="md">
                <Modal.Body className="p-0">
                    <div className="m-4 flex flex-col justify-center items-center text-white">
                        {modalStatus === "loading" ?
                        <>
                            <Spinner color="secondary" className="size-8 mb-2"/>
                            <div>Creating thread <BlinkingDots/></div> 
                        </> :
                        <>
                            <ExclamationCircleIcon className="size-8 mb-2 text-red-500"/>
                            <div className="mb-2">{errorMessage}</div>
                            <div className="flex gap-4">
                                <Button color="secondary"><ArrowPathIcon className="size-4 mr-2 place-self-center"/> Retry</Button>
                                <Button color="gray" onClick={() => setModalStatus("idle")}><XMarkIcon className="size-4 mr-2 place-self-center"/>  Cancel</Button>
                            </div>
                        </>}
                    </div>
                </Modal.Body>
            </Modal>
        </form>
    )
}

async function voteThread(thread: Thread, action: VoteAction) {
    const response = await api.put(`/v1/threads/${thread._id}/${action}`);
    $box.set({
        ...$box.get()!,
        threads: $box.get()!.threads?.map(t => t._id === thread._id ? {
            ...t,
            voteStatus: response.data.voteStatus,
            score: t.score + response.data.voteStatus - t.voteStatus
        } : t)
    });
}

interface ThreadCommentCounterProps {
    thread: Thread;
    vertical?: boolean;
}

export function ThreadCommentCounter(props: ThreadCommentCounterProps) {
    return (
        <div className="text-sm rounded-lg border align-middle p-2">{props.thread.commentCount + (props.vertical === true ? "" : " comments")}</div>
    );
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

interface ThreadInfomationProps {
    thread: Thread;
    vertical?: boolean;
}

export function ThreadPreviewInfomation(props: ThreadInfomationProps) {
    const [avatarUrl, setAvatar] = useState<string>();

    async function renderAvatar() {
        if (props.thread.author) {
            const thumbnail = await getFirebaseThumbnail(props.thread.author.avatarUrl, AVATAR_THUMBNAIL_HEIGHT);
            if (thumbnail && typeof thumbnail === "string") {
                setAvatar(thumbnail);
            }
        }
    }

    async function toggleThreadVisibilityInBox() {
        await api.patch(`/v1/threads/${props.thread._id}`, {
            visibility: !props.thread.visibility
        });
        $box.set({
            ...$box.get()!,
            threads: $box.get()!.threads?.map(t => t._id === props.thread._id ? {
                ...t,
                visibility: !t.visibility
            } : t)
        });
    }
    
    useEffect(() => {
        if (props.vertical !== true) {
            renderAvatar();
        }
    }, []);

    return (
        props.vertical === true ?
        <>
            <Voter content={props.thread} onVote={(action) => voteThread(props.thread, action)} vertical/>
            <div className="text-center mt-2">
                <ThreadCommentCounter thread={props.thread} vertical/>
            </div>
            <div className="mt-2 flex justify-center">
                <VisibilityToggle content={props.thread} onToggle={toggleThreadVisibilityInBox}/>
            </div>
        </> :    
        <div className="flex justify-between flex-wrap">
            <div className="flex gap-2 justify-center">
                <Avatar img={avatarUrl}/>
                <div className="flex flex-col justify-center">
                    <Link className="text-sm hover:underline" to={`/user/${props.thread.author?._id}`}>{props.thread.author?.displayName}</Link>
                    <div className="text-xs">{getTimePassed(props.thread.createdAt)}</div>
                </div>
                <div className="py-2 ms-2 md:flex justify-stretch items-center gap-4 hidden">
                    <ThreadCommentCounter thread={props.thread}/>
                    <Voter onVote={(action) => voteThread(props.thread, action)} content={props.thread}/>
                    <VisibilityToggle content={props.thread} onToggle={toggleThreadVisibilityInBox}/>
                </div>
            </div>
        </div>
    );
}