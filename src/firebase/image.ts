import { Buffer } from "buffer/";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "./config";
import { JSONContent } from "@tiptap/react";

const FirebaseStorageRegex = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/forusdb\.appspot\.com\/o\/(?:[^\/]*\/)*([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/;

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

export async function uploadImages(imgObjects: JSONContent[]): Promise<string[]> {
    return await Promise.all(imgObjects.map(async (imgObject, index) => {
        // check if the src attribute is data url
        if (imgObject.attrs) {
            if (imgObject.attrs.src.startsWith('data:')) {
                const mimeType = imgObject.attrs.src.split(';')[0].split(':')[1];
                const extension = mimeType.split('/')[1];
                const base64 = imgObject.attrs?.src.split(',')[1];
                const buffer = Buffer.from(base64, 'base64');
                const file = new File([buffer], `${index}.${extension}`, {type: mimeType});
                return await uploadImage(file, '/content');
            } else {
                const match = imgObject.attrs.src.match(FirebaseStorageRegex);
                if (match) {
                    return `images/content/${match[1]}`;
                } else {
                    return imgObject.attrs.src;
                }
            }
        }
    }));
}

export async function deleteImage(url: string) {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}

