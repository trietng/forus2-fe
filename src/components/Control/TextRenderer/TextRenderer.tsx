import "../../../styles/text.css";
import { generateHTML, JSONContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { TiptapExtensions } from "../config/text";
import { findFirstImage, findImages, summarize } from "../../../utils/json-content";
import { getImage } from "../../../firebase/image";
import { getThumbnail } from "../../../firebase/thumbnail";

interface TextRendererProps {
    preview?: boolean;
    onPreviewImageAvailable?: (data: string) => void;
    text: string;
}

export function TextRenderer(props: TextRendererProps) {
    const [output, setOutput] = useState<string>('');

    async function render() {
        const json: JSONContent = JSON.parse(props.text);
        const images = findImages(json);
        if (props.onPreviewImageAvailable && images.length > 0) {
            const thumbnail = await getThumbnail(images[0].attrs?.src, 96);
            if (thumbnail && typeof thumbnail === 'string') {
                props.onPreviewImageAvailable(thumbnail);
            }
        }
        await Promise.all(images.map(async (image) => {
            if (image.attrs?.src) {
                image.attrs.src = await getImage(image.attrs.src);
            }
        }));
        const html = generateHTML(json, TiptapExtensions);
        setOutput(html);
    }

    async function renderPreview() {
        const json: JSONContent = JSON.parse(props.text);
        const summary = summarize(json);
        const image = findFirstImage(json);
        setOutput(summary);
        if (props.onPreviewImageAvailable && image && image.attrs) {
            const thumbnail = await getThumbnail(image.attrs.src, 12);
            if (thumbnail && typeof thumbnail === 'string') {
                props.onPreviewImageAvailable(thumbnail);
            }
        }
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
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: output }} />
    );
}