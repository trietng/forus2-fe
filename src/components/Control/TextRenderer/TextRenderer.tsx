import "../../../styles/text.css";
import { generateHTML, JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { TiptapExtensions } from "../config/text";
import { findFirstImage, findImages, summarize } from "../../../utils/json-content";
import { getImage } from "../../../firebase/image";
import { getFirebaseThumbnail, getThumbnail } from "../../../firebase/thumbnail";
import { THREAD_PREVIEW_THUMBNAIL_HEIGHT } from "../../../constants/thumbnail";

interface TextRendererProps {
    text: string;
    preview?: boolean;
    onPreviewImageAvailable?: (data: string) => void;
}


export async function processText(text: string) {
    const json: JSONContent = JSON.parse(text);
    const images = findImages(json);
    await Promise.all(images.map(async (image) => {
        if (image.attrs && image.attrs.src.startsWith('images/')) {
            image.attrs.src = await getImage(image.attrs.src);
        }
    }));
    return json;
}

export function TextRenderer(props: TextRendererProps) {
    const [output, setOutput] = useState<string>('');

    async function render() {
        const json = await processText(props.text);
        const html = generateHTML(json, TiptapExtensions);
        setOutput(html);
    }

    async function renderPreview() {
        const json: JSONContent = JSON.parse(props.text);
        const summary = summarize(json);
        const image = findFirstImage(json);
        if (props.onPreviewImageAvailable && image && image.attrs) {
            let thumbnail;
            if (image.attrs.src.startsWith('images/')) {
                thumbnail = await getFirebaseThumbnail(image.attrs.src, THREAD_PREVIEW_THUMBNAIL_HEIGHT);
            } else {
                thumbnail = await getThumbnail(image.attrs.src, THREAD_PREVIEW_THUMBNAIL_HEIGHT);
            }
            if (thumbnail && typeof thumbnail === 'string') {
                props.onPreviewImageAvailable(thumbnail);
            }
        }
        const summaryAligned = `<div class="text-justify">${summary}</div>`;
        setOutput(summaryAligned);
    }

    useEffect(() => {
        if (props.preview === true) {  
            renderPreview();
        }
        else {
            render();
        }
    }, [props.text]);

    return (
        <div className="text-sm tiptap" dangerouslySetInnerHTML={{ __html: output }} />
    );
}