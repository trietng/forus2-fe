import { Pagination } from "flowbite-react";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { type Thread } from "../../models/thread";
import { api } from "../../api";
import { useEffect, useState } from "react";
import { ContentCard } from "../../components/ContentCard";
import { ThreadCommentCounter, ThreadDeleter, VisibilityToggle } from "../../components/Control/Thread";
import { VoteAction, Voter } from "../../components/Voter/Voter";
import { openThreadModal, ThreadModal } from "../../components/Modal/Thread";
import { ContentEditToggle } from "../../components/Control/Content";
import { JSONContent } from "@tiptap/react";
import { $contentModalState } from "../../components/Modal/Content";

export function Thread() {
    const navigate = useNavigate();
    const params = useParams();
    const [thread, setThread] = useState<Thread>();
    
    const page = Number.parseInt(params.page || '1');

    async function fetchThread() {
        // Fetch thread
        const response = await api.get(`v1/threads/${params.id}/${page}`);
        setThread(response.data);
    }

    async function toggleThreadVisibility() {
        await api.patch(`/v1/threads/${thread?._id}`, {
            visibility: !thread?.visibility
        });
        setThread({
            ...thread!,
            visibility: !thread!.visibility
        });
    }

    async function voteThread(action: VoteAction) {
        if (thread && thread.voteStatus) {
            const response = await api.put(`/v1/threads/${thread._id}/${action}`);
            setThread({
                ...thread,
                voteStatus: response.data.voteStatus,
                score: thread.score + response.data.voteStatus - thread.voteStatus
            });
        }
    }

    async function saveThread(body: JSONContent) {
        const updatedBody = JSON.stringify(body);
        await api.patch(`/v1/threads/${thread?._id}`, {
            body: updatedBody
        });
        setThread({
            ...thread!,
            body: updatedBody
        });
        $contentModalState.set("idle");
    }

    useEffect(() => {
        fetchThread();
    }, [params.id, page]);

    if (!thread) return null;

    return (
        <>
            <ForusBreadcrumb urls={[
                { label: thread.box?.group?.name || 'Group', link: thread.box?.group?.name ? `/all#${thread.box?.group?._id}` : '' },
                { label: thread.box?.name || 'Box', link: `/box/${thread.box?._id}` },
                { label: thread.title || 'Thread', link: `/thread/${thread._id}`, disabled: true }
            ]}/>
            <div className="mt-4 flex justify-between">
                {(thread.pageCount || 1) > 1 ? 
                <Pagination showIcons currentPage={page} onPageChange={(p) => {}} totalPages={thread.pageCount || 0}/> :
                <div></div>}
            </div>
            <ContentCard content={thread} informationSlot={
                <>
                    <Voter onVote={(action) => voteThread(action)} content={thread}/>
                    <ThreadCommentCounter thread={thread}/>
                </>
            } controlSlot={
                <>
                    <ContentEditToggle content={thread}/>
                    <VisibilityToggle content={thread} onToggle={toggleThreadVisibility}/>
                    <ThreadDeleter thread={thread} onClick={() => openThreadModal("delete", thread, "goback")}/>
                </>
            } onSaveContent={saveThread}/>
            <ThreadModal/>
        </>
    );
}