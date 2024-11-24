import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { route } from "../../utils/search";
import { api } from "../../api";
import { Avatar, Pagination } from "flowbite-react";
import { ContentCard } from "../../components/ContentCard";
import { ThreadCommentCounter } from "../../components/Control/Thread";
import { Voter } from "../../components/Voter";
import { getFirebaseThumbnail } from "../../firebase/thumbnail";
import { SearchResult } from "../../models/search";

interface RenderedAvatarProps {
    user: any;
}

function RenderedAvatar(props: RenderedAvatarProps) {
    const [avatarUrl, setAvatarUrl] = useState<string>();

    async function renderAvatar() {
        if (props.user) {
            const image = await getFirebaseThumbnail(props.user.avatarUrl, 40);
            if (image && typeof image === "string") {
                setAvatarUrl(image);
            }
        }
    }

    useEffect(() => {
        renderAvatar();
    }, [props.user]);
    return (
        <Avatar size="md" img={avatarUrl}/>
    );
}

export function Search() {
    const navigate = useNavigate();
    const [searchParams, ] = useSearchParams();
    const params = useParams();

    const order = searchParams.get('order');
    const direction = searchParams.get('direction');
    const type = searchParams.get('type');
    const q = searchParams.get('q');
    const [result, setResult] = useState<SearchResult>({
        metadata: {
            total: 0,
            pageCount: 1
        }
    });

    async function getResult() {
        try {
            if (!q || !type || !params.page || !order || !direction) {
                navigate('/404', { replace: true });
            } else {
                const page = Number.parseInt(params.page);
                const response = await api.get(`/v1${route(q, type, page, order, direction)}`);
                const data = response.data as SearchResult;
                if (data) {
                    setResult(response.data);
                } else {
                    setResult({
                        metadata: {
                            total: 0,
                            pageCount: 1
                        }
                    });
                }
                if (page > 1 && page > data.metadata.pageCount) {
                    navigate(route(q, type, 1, order, direction), { replace: true });
                }
            }
        } catch (e) {
            //navigate("/404", { replace: true });
        }
    }

    function handlePageChange(page: number) {
        navigate(route(q!, type!, page, order!, direction!));
    }

    useEffect(() => {
        getResult();
    }, [q, type, params.page, order, direction]);

    return (
        result && <div className="my-4 w-full">
            <div className="font-bold">
                <div className="text-4xl">Search results for "{q}"</div>
                <div className="text-lg">{result.metadata.total} results</div>
            </div>
            <div className="flex gap-4 mt-4">
                <Link className={"rounded-lg p-2 hover:text-secondary hover:bg-black/20" + (type === "thread" ? " bg-black/10" : "")} to={route(q!, "thread")}>Thread</Link>
                <Link className={"rounded-lg p-2 hover:text-secondary hover:bg-black/20" + (type === "user" ? " bg-black/10" : "")} to={route(q!, "user")}>User</Link>
                <Link className={"rounded-lg p-2 hover:text-secondary hover:bg-black/20" + (type === "box" ? " bg-black/10" : "")} to={route(q!, "box")}>Box</Link>
            </div>
            <div className="flex justify-between mt-4">
                <Pagination showIcons currentPage={parseInt(params.page || '1')} onPageChange={(p) => handlePageChange(p)} totalPages={result.metadata.pageCount || 0}/>
                
            </div>
            {result.threads && result.threads.map((thread) => (
                <div className="mt-4" key={thread._id}>
                    <ContentCard content={thread} afterSlot={
                        <div className="flex gap-4 mt-4">
                            <Link to={`/user/${thread.author?._id}`} className="rounded-lg border align-middle p-2 hover:underline">
                                {thread.author?.username}
                            </Link>
                            <ThreadCommentCounter thread={thread}/>
                            <Voter content={thread}/>
                        </div>
                    } hideUserInformation showLinkToThread/>
                </div>
            ))}
            {result.users && <div className="flex gap-4 mt-4 flex-wrap">
                {result.users.map((user) => (
                    <div className="bg-body-secondary inline-flex flex-col rounded-lg p-4 text-center" key={user._id}>
                        <RenderedAvatar user={user}/>
                        <Link className="text-sm font-medium mt-1 hover:underline" to={`/user/${user._id}`}>{user.username}</Link>
                    </div>
                ))}
            </div>}
            {result.boxes && <div className="grid md:grid-cols-2 gap-4 mt-4">
                {result.boxes.map((box) => (
                    <div className="rounded-lg flex p-4 gap-4 items-center justify-between bg-body-secondary" key={box._id}>
                        <Link to={`/box/${box._id}`} className="text-lg font-bold hover:underline">{box.name}</Link>
                        <div className="flex gap-4 justify-evenly">
                            <div className="flex flex-col items-center justify-center">
                                <div>Threads</div>
                                <div>{box.threadCount}</div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <div>Subscribers</div>
                                <div>{box.subscriberCount}</div>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            }
        </div>
    )
}