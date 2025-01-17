import { Card } from "@heroui/react";
import { Thread } from "../../models/thread";
import { TextRenderer } from "../Control/TextRenderer/TextRenderer";
import { useState } from "react"
import { Link } from "react-router-dom";
import { ThreadPreviewInfomation } from "../Control/Thread";

interface ThreadPreviewCardProps {
    thread: Thread;
}

export function ThreadPreviewCard(props: ThreadPreviewCardProps) {
    const [previewImage, setPreviewImage] = useState<string>();

    return (
        <Card className="bg-forus-body-secondary border-none p-6 text-white">
            <div className="flex gap-4 justify-between" >
                <div className="md:hidden">
                    <ThreadPreviewInfomation thread={props.thread} vertical/>
                </div>
                <div className="flex flex-col w-full justify-between">
                    <div>
                        <Link className="text-lg font-semibold hover:underline" to={`/thread/${props.thread._id}`}>{props.thread.title}</Link>
                        <div className="text-sm my-2">
                            <TextRenderer text={props.thread.body} preview onPreviewImageAvailable={(data) => setPreviewImage(data)}/>
                        </div>
                    </div>
                    <div>
                        <ThreadPreviewInfomation thread={props.thread}/>
                    </div>
                </div>
                {previewImage && <img src={previewImage} alt="Preview" className="size-24 object-cover rounded-lg border bg-white" />}
            </div>
        </Card>
    );
}