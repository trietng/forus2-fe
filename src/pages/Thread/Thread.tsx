import { Pagination } from "flowbite-react";
import { ForusBreadcrumb } from "../../components/Routing/ForusBreadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { $thread } from "../../models/thread";
import { api } from "../../api";
import { useEffect } from "react";
import { ContentCard } from "../../components/ContentCard";
import { ThreadCommentCounter, VisibilityToggle } from "../../components/Control/Thread";
import { Voter } from "../../components/Voter/Voter";

export function Thread() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const thread = useStore($thread);

    const page = Number.parseInt(params.page || '1');

    async function fetchThread() {
        // Fetch thread
        const response = await api.get(`v1/threads/${params.id}/${page}`);
        $thread.set(response.data);
    }

    async function toggleThreadVisibility() {
        await api.patch(`/v1/threads/${thread?._id}`, {
            visibility: !thread?.visibility
        });
        $thread.set({
            ...$thread.get()!,
            visibility: !$thread.get()!.visibility
        });
    }

    useEffect(() => {
        fetchThread();
    }, []);

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
                    <Voter onVote={(action) => {}} content={thread}/>
                    <ThreadCommentCounter thread={thread}/>
                    <VisibilityToggle content={thread} onToggle={toggleThreadVisibility}/>
                </>
            }/>
        </>
    );
}