import { Pagination } from "flowbite-react";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { type Thread } from "../../models/thread";
import { api } from "../../api";
import { useEffect, useLayoutEffect, useState } from "react";
import { ContentCard } from "../../components/ContentCard";
import { ThreadCommentCounter } from "../../components/Control/Thread";
import { VoteAction, Voter } from "../../components/Voter/Voter";
import { openThreadModal, ThreadModal } from "../../components/Modal/Thread";
import { ContentDeleter, ContentEditToggle, VisibilityToggle } from "../../components/Control/Content";
import { JSONContent } from "@tiptap/react";
import { $contentModalState } from "../../components/Modal/Content";
import { CommentCreator } from "../../components/Control/Comment";
import { Comment } from "../../models/comment";
import { CommentModal, openCommentModal } from "../../components/Modal/Comment";

export function Thread() {
    const navigate = useNavigate();
    const params = useParams();
    const [thread, setThread] = useState<Thread>();
    
    const page = Number.parseInt(params.page || '1');

    async function fetchThread() {
        // Fetch thread
        try {
            const response = await api.get(`v1/threads/${params.id}/${page}`);
            setThread(response.data);
        } catch (error: any) {
            if (error.response?.status === 404) {
                navigate('/404', { replace: true });
            }
        };
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

    async function toggleCommentVisibility(comment: Comment) {
        await api.patch(`/v1/comments/${comment._id}`, {
            visibility: !comment.visibility
        });
        setThread({
            ...thread!,
            comments: thread!.comments.map(c => {
                if (c._id === comment._id) {
                    return {
                        ...c,
                        visibility: !c.visibility
                    };
                }
                return c;
            })
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

    async function voteComment(comment: Comment, action: VoteAction) {
        const response = await api.put(`/v1/comments/${comment._id}/${action}`);
        setThread({
            ...thread!,
            comments: thread!.comments.map(c => {
                if (c._id === comment._id) {
                    return {
                        ...c,
                        voteStatus: response.data.voteStatus,
                        score: c.score + response.data.voteStatus - c.voteStatus!
                    };
                }
                return c;
            })
        });
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

    async function saveComment(comment: Comment, body: JSONContent) {
        const updatedBody = JSON.stringify(body);
        await api.patch(`/v1/comments/${comment?._id}`, {
            body: updatedBody
        });
        setThread({
            ...thread!,
            comments: thread!.comments.map(c => {
                if (c._id === comment._id) {
                    return {
                        ...c,
                        body: updatedBody
                    };
                }
                return c;
            })
        });
        $contentModalState.set("idle");
    }

    function handlePageChange(page: number) {
        navigate(`/thread/${params.id}/${page}`);
    }

    useLayoutEffect(() => {
        if (params.id == null) {
            navigate('/404', { replace: true });
        }
        else {
            if (page <= 1) {
                navigate(`/thread/${params.id}`, { replace: true });
            }
        }
    }, []);

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
            <div className="mt-4">
                <ContentCard content={thread} informationSlot={
                    <>
                        <Voter onVote={(action) => voteThread(action)} content={thread}/>
                        <ThreadCommentCounter thread={thread}/>
                    </>
                } controlSlot={
                    <>
                        <ContentEditToggle content={thread}/>
                        <VisibilityToggle content={thread} onToggle={toggleThreadVisibility}/>
                        <ContentDeleter content={thread} onClick={() => openThreadModal("delete", thread, "goback")}/>
                    </>
                } onSaveContent={saveThread}/>
            </div>
            <div className="mt-4 flex justify-between">
                <Pagination showIcons currentPage={page} onPageChange={(p) => {handlePageChange(p)}} totalPages={thread.pageCount || 0}/>
            </div>
            {thread.comments?.map(comment => 
                <div className="mt-4" key={comment._id}>
                    <ContentCard content={comment} informationSlot={
                        <>
                            <Voter onVote={(action) => voteComment(comment, action)} content={comment}/>
                        </>
                    } controlSlot={
                        <>
                            <ContentEditToggle content={comment}/>
                            <VisibilityToggle content={comment} onToggle={() => toggleCommentVisibility(comment)}/>
                            <ContentDeleter content={comment} onClick={() => openCommentModal("delete", comment)}/>
                        </>
                    } onSaveContent={(body) => saveComment(comment, body)}/>
                </div>
            )}
            <div className="mt-4">
                <CommentCreator thread={thread} onCommentCreated={() => fetchThread()}/>
            </div>
            <ThreadModal/>
            <CommentModal onRefresh={() => fetchThread()}/>
        </>
    );
}