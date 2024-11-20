import { JSONContent } from "@tiptap/react";

function recursiveFindImages(content: JSONContent, images: JSONContent[]) {
    content.content?.forEach(item => {
        if (item.type === "image") {
            images.push(item);
        }
        recursiveFindImages(item, images);
    });
}

export function findImages(content: JSONContent): JSONContent[] {
    const images: JSONContent[] = [];
    recursiveFindImages(content, images);
    return images;
}

function recursiveFindFirstImage(content: JSONContent): JSONContent | null {
    for (const item of content.content || []) {
        if (item.type === "image") {
            return item;
        }
        const image = recursiveFindFirstImage(item);
        if (image) {
            return image;
        }
    }
    return null;
}

export function findFirstImage(content: JSONContent): JSONContent | null {
    return recursiveFindFirstImage(content);
}

function recursiveSummarize(content: JSONContent, summaryData: string[]) {
    content.content?.forEach(item => {
        if (item.text) {
            summaryData.push(item.text);
        }
        recursiveSummarize(item, summaryData);
    });
}


export function summarize(content: JSONContent, length: number = 512): string {
    const summaryData: string[] = [];
    recursiveSummarize(content, summaryData);
    return summaryData.join(' ').substring(0, length);
}