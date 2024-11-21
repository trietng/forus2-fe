import { Card } from "flowbite-react";
import { Thread } from "../../models/thread";
import { TextRenderer } from "../Control/TextRenderer/TextRenderer";
import { useState } from "react"
import { Link } from "react-router-dom";
import { ThreadCommentCounter, ThreadInfomation, voteThread } from "../Control/Thread";
import { Voter } from "../Voter/Voter";

interface ThreadPreviewCardProps {
    thread: Thread;
}

export function ThreadPreviewCard(props: ThreadPreviewCardProps) {
    const [previewImage, setPreviewImage] = useState<string>();

    return (
        <Card className="bg-body-secondary">
            <div className="flex gap-4 justify-between" >
                <div className="md:hidden">
                    <Voter content={props.thread} onVote={(action) => voteThread(props.thread, action)} vertical/>
                    <div className="text-center mt-2">
                        <ThreadCommentCounter thread={props.thread} vertical/>
                    </div>
                </div>
                <div className="flex flex-col w-full justify-between">
                    <div>
                        <Link className="text-lg font-semibold hover:underline" to={`/thread/${props.thread._id}`}>{props.thread.title}</Link>
                        <div className="text-sm my-2">
                            <TextRenderer text={props.thread.body} preview onPreviewImageAvailable={(data) => setPreviewImage(data)}/>
                        </div>
                    </div>
                    <div>
                        <ThreadInfomation thread={props.thread}/>
                    </div>
                </div>
                {previewImage && <img src={previewImage} alt="Preview" className="size-24 object-cover rounded-lg border bg-white" />}
            </div>
        </Card>
    );
}