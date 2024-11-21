import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Content } from "../../models/content";

export type VoteAction = "upvote" | "downvote";

interface VoterProps {
    content: Content;
    onVote: (action: VoteAction) => void;
    vertical?: boolean;
}

export function Voter(props: VoterProps) {
    return (
        <div className={"flex text-sm border rounded-lg items-center overflow-hidden" + (props.vertical === true ? " flex-col" : "")}>
            <button onClick={() => {props.onVote("upvote");}} className={
                "hover:bg-green-500 p-2 text-center" + 
                (props.vertical === true ? " w-full" : " h-full") +
                (props.content.voteStatus === 1 ? " bg-green-500" : "")
            }>
                <ChevronUpIcon className="size-4 inline"/>
            </button>
            <div className={"p-2 min-w-12 text-center" + (props.vertical === true ? " border-y" : " border-x")}>{props.content.score}</div>
            <button onClick={() => props.onVote("downvote")} className={
                "hover:bg-red-500 p-2 text-center" + 
                (props.vertical === true ? " w-full" : " h-full") +
                (props.content.voteStatus === -1 ? " bg-red-500" : "")
            }>
                <ChevronDownIcon className="size-4 inline"/>
            </button>
        </div>
    );
}