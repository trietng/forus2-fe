import { Card } from "flowbite-react";
import { Thread } from "../../models/thread";
import { TextRenderer } from "../Control/TextRenderer/TextRenderer";
import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

interface ThreadPreviewCardProps {
    thread: Thread;
}

export function ThreadPreviewCard(props: ThreadPreviewCardProps) {
    const [previewImage, setPreviewImage] = useState<string>();

    return (
        <Card className="bg-body-secondary">
            <div className="flex gap-4">
                {previewImage ? 
                <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover" /> :
                <PhotoIcon className="w-24 h-24" />}
                <div className="flex flex-col w-full">
                    <div className="text-lg font-semibold">{props.thread.title}</div>
                    <div className="text-sm mt-2">
                        <TextRenderer text={props.thread.body} preview onPreviewImageAvailable={(data) => setPreviewImage(data)}/>
                    </div>
                </div>
            </div>
        </Card>
    );
}