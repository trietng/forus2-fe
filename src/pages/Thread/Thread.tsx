// import { Pagination } from "@heroui/react";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { type Thread } from "../../models/thread";
import { api } from "../../api";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ContentCard } from "../../components/ContentCard";
import { ThreadCommentCounter } from "../../components/Control/Thread";
import { VoteAction, Voter } from "../../components/Voter";
import { openThreadModal, ThreadModal } from "../../components/Modal/Thread";
import { ContentDeleter, ContentEditToggle, ContentReplier, VisibilityToggle } from "../../components/Control/Content";
import { JSONContent } from "@tiptap/react";
import { $contentModalState } from "../../components/Modal/Content";
import { CommentCreator, MissingReply, Reply } from "../../components/Control/Comment";
import { Comment } from "../../models/comment";
import { CommentModal, openCommentModal } from "../../components/Modal/Comment";
import { Pagination } from "@heroui/react";

export function Thread() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const commentCreatorRef = useRef<HTMLDivElement>(null);
    const [thread, setThread] = useState<Thread>();
    const [reply, setReply] = useState<Comment>();
    
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

    function jumpToCommentCreator(reply?: Comment) {
        commentCreatorRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (reply) {
            setReply(reply);
        } else {
            setReply(undefined);
        }
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

    useEffect(() => {
        // scroll to hash
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location.hash]);

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
                        <ContentReplier content={thread} onClick={() => jumpToCommentCreator()}/>
                        <ContentEditToggle content={thread}/>
                        <VisibilityToggle content={thread} onToggle={toggleThreadVisibility}/>
                        <ContentDeleter content={thread} onClick={() => openThreadModal("delete", thread, "goback")}/>
                    </>
                } onSaveContent={saveThread}/>
            </div>
            <div className="mt-4 flex justify-between">
                <Pagination isCompact showControls page={page} onChange={handlePageChange} total={thread.pageCount || 0}/>
            </div>
            {thread.comments?.map(comment => 
                <div className="mt-4" key={comment._id}>
                    <ContentCard content={comment} informationSlot={
                        <>
                            <Voter onVote={(action) => voteComment(comment, action)} content={comment}/>
                        </>
                    } controlSlot={
                        <>
                            <ContentReplier content={comment} onClick={() => jumpToCommentCreator(comment)}/>
                            <ContentEditToggle content={comment}/>
                            <VisibilityToggle content={comment} onToggle={() => toggleCommentVisibility(comment)}/>
                            <ContentDeleter content={comment} onClick={() => openCommentModal("delete", comment)}/>
                        </>
                    } beforeSlot={
                        <div className="mb-4">
                            {comment.reply ?
                            <Reply reply={comment.reply} mode="reply"/> : (
                                comment.replyTo && <MissingReply/>
                            )}
                        </div>
                    } onSaveContent={(body) => saveComment(comment, body)}/>
                </div>
            )}
            <div className="mt-4" ref={commentCreatorRef} id="commentCreator">
                <CommentCreator thread={thread} onCommentCreated={() => fetchThread()} reply={reply} onClearReply={() => setReply(undefined)}/>
            </div>
            <ThreadModal/>
            <CommentModal onRefresh={() => fetchThread()}/>
        </>
    );
}