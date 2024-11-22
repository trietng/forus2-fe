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
        // check if the src attribute is data url
        console.log(imgObject.attrs?.src);
        if (imgObject.attrs?.src.startsWith('data:')) {
            const mimeType = imgObject.attrs?.src.split(';')[0].split(':')[1];
            const extension = mimeType.split('/')[1];
            const base64 = imgObject.attrs?.src.split(',')[1];
            const buffer = Buffer.from(base64, 'base64');
            const file = new File([buffer], `${index}.${extension}`, {type: mimeType});
            return await uploadImage(file, '/content');
        } else {
            return imgObject.attrs?.src;
        }
    }));
}

export async function deleteImage(url: string) {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}

