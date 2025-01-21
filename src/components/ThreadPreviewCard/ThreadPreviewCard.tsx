import { useState } from "react"
import { Card, Link } from "@heroui/react";
import { Thread } from "../../models/thread";
import { TextRenderer } from "../Control/TextRenderer/TextRenderer";
import { ThreadInfomationMode, ThreadPreviewInfomation } from "../Control/Thread";

interface ThreadPreviewCardProps {
    thread: Thread;
    mode: ThreadInfomationMode;
}

export function ThreadPreviewCard(props: ThreadPreviewCardProps) {
    const [previewImage, setPreviewImage] = useState<string>();

    return (
        <Card className="bg-forus-body-secondary border-none p-6 text-white">
            <div className="flex gap-4 justify-between" >
                <div className="md:hidden">
                    <ThreadPreviewInfomation thread={props.thread} vertical mode={props.mode}/>
                </div>
                <div className="flex flex-col w-full justify-between">
                    <div>
                        <Link href={`/thread/${props.thread._id}`} className="font-bold text-lg text-white border rounded-xl p-2 md:border-0 md:p-0 md:hover:underline">{props.thread.title}</Link>
                        <div className="text-sm my-2">
                            <TextRenderer text={props.thread.body} preview onPreviewImageAvailable={(data) => setPreviewImage(data)}/>
                        </div>
                    </div>
                    <div>
                        <ThreadPreviewInfomation thread={props.thread} mode={props.mode}/>
                    </div>
                </div>
                {previewImage && <img src={previewImage} alt="Preview" className="size-24 object-cover rounded-lg border bg-white" />}
            </div>
        </Card>
    );
}