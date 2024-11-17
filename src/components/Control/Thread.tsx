import { TextInput } from "flowbite-react";
import { $content, ContentEditorMode, TextEditor } from "./TextEditor/TextEditor";
import { useState } from "react";
import { THREAD_MAX_TITLE_LENGTH } from "../../constants/validation";
import { useStore } from "@nanostores/react";

interface ThreadEditorProps {
    mode: ContentEditorMode;
}

export function ThreadEditor(props: ThreadEditorProps) {
    const content = useStore($content);
    const [title, setTitle] = useState<string>('');

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value);
        console.log(title, content);
    }

    return (
        <div className="mt-4">
            {props.mode === "create" && 
                <div className="flex">
                    <TextInput color="primary" className="[&_input]:rounded-e-none w-full" maxLength={THREAD_MAX_TITLE_LENGTH} onChange={handleTitleChange} placeholder="Title"/>
                    <div className="bg-primary rounded-r-lg p-2 border-s text-sm text-center">
                        {title.length}/{THREAD_MAX_TITLE_LENGTH}
                    </div>
                </div>
            }
            <TextEditor />
        </div>
    )
}