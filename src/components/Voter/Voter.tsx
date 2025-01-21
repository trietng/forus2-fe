import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Content } from "../../models/content";

export type VoteAction = "upvote" | "downvote";

interface VoterProps {
    content: Content;
    onVote?: (action: VoteAction) => void;
    vertical?: boolean;
}

export function Voter(props: VoterProps) {
    return (
        <div className={"flex text-sm border rounded-lg items-center" + (props.vertical === true ? " flex-col" : "")}>
            <button onClick={() => {
                if (props.onVote) {
                    props.onVote("upvote");
                }
            }} className={
                "hover:bg-green-500 p-2 text-center rounded-t-lg md:rounded-s-lg md:rounded-tr-none" + 
                (props.vertical === true ? " w-full" : " h-full") +
                (props.content.voteStatus === 1 ? " bg-green-500" : "") +
                (props.onVote ? "" : " cursor-not-allowed")
            }>
                <ChevronUpIcon className="size-4 inline"/>
            </button>
            <div className={"p-2 min-w-12 text-center" + (props.vertical === true ? " border-y" : " border-x")}>{props.content.score}</div>
            <button onClick={() => {
                if (props.onVote) {
                    props.onVote("downvote");
                }
            }} className={
                "hover:bg-red-500 p-2 text-center rounded-b-lg md:rounded-e-lg md:rounded-bl-none" + 
                (props.vertical === true ? " w-full" : " h-full") +
                (props.content.voteStatus === -1 ? " bg-red-500" : "") +
                (props.onVote ? "" : " cursor-not-allowed")
            }>
                <ChevronDownIcon className="size-4 inline"/>
            </button>
        </div>
    );
}