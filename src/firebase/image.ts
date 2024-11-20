import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "./config";
import { JSONContent } from "@tiptap/react";

export async function getImage(url: string) {
    const imageReference = ref(storage, url);
    return await getDownloadURL(imageReference);
}

export async function uploadImage(file: File, path: string) {
    const imageId = v4();
    const imageRef = ref(storage, `images/${path}/${imageId}`);
    const snapshot = await uploadBytes(imageRef, file);
    return snapshot.ref.fullPath;
}

export async function uploadImages(imgObjects: JSONContent[]) {
    return await Promise.all(imgObjects.map(async (imgObject, index) => {
        const mimeType = imgObject.attrs?.src.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        const response = await fetch(imgObject.attrs?.src);
        const blob = await response.blob();
        const file = new File([blob], `${index}.${extension}`, {type: mimeType});
        return await uploadImage(file, '/content');
    }));
}

export async function deleteImage(url: string) {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}

