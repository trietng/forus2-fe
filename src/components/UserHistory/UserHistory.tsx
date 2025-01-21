import { RefObject, useState } from "react";
import { Button, Spinner, Link } from "@heroui/react";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { ThreadPreviewCard } from "../ThreadPreviewCard";
import { api } from "../../api";
import { ContentCard } from "../ContentCard";
import { Voter } from "../Voter";

export interface UserHistoryProps {
    userId?: string;
    contentType: "threads" | "comments";
}

export function UserHistory(props: UserHistoryProps) {
    const [hasMore, setHasMore] = useState(false);
  
    let list = useAsyncList<any, string>({
        async load({signal, cursor}) {
            // If no cursor is available, then we're loading the first page.
            // Otherwise, the cursor is the next URL to load, as returned from the previous page.
            const resp = await api.get(cursor || `/v1/users/${props.userId}/${props.contentType}/1`, {signal});
            let json = resp.data;
    
            setHasMore(json.next !== null);
    
            return {
                items: json.results,
                cursor: `/v1/users/${props.userId}/${props.contentType}/${json.next}`,
            };
        },
    });
  
    const [loaderRef, scrollerRef] = useInfiniteScroll({hasMore, onLoadMore: list.loadMore});

    return (
        <ul 
            ref={scrollerRef as RefObject<HTMLUListElement>}
            className="overflow-y-scroll space-y-4">
            {list.items.map((content) =>(
                <li key={content._id}>
                    {props.contentType === "threads" ? 
                    <ThreadPreviewCard thread={content} mode="compact"/> :
                    <ContentCard content={content} informationSlot={
                        <Voter content={content}/>
                    } controlSlot={
                        <Button as={Link} href={`/thread/`} variant="faded" className="text-forus-body-primary border-forus-body-primary">View Thread</Button>
                    }
                    hideUserInformation/>}
                </li>
            ))}
            {hasMore && <li><Spinner ref={loaderRef} color="secondary" className="left-1/2 -translate-x-1/2"/></li>}
        </ul>
    );
}