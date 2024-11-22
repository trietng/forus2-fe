import { Button } from "flowbite-react";
import { TextEditor } from "./TextEditor";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Content } from "../../models/content";
import { useState } from "react";
import { JSONContent } from "@tiptap/react";
import { TextRenderer } from "./TextRenderer";

interface EditableContentProps {
    content: Content;
}

export function EditableContent(props: EditableContentProps) {
    const [content, setContent] = useState<JSONContent>();

    return (
        content 
        ? <>
            <TextEditor text={content} onChange={(content) => {}} />
            <Button color="secondary" className="mt-4 float-end">
                <PlusIcon className="place-self-center inline size-4 mr-2"/> Save
            </Button>
        </>
        : <TextRenderer text={props.content.body} />
    )
}