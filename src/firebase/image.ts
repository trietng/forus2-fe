import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "./config";

export async function getImage(url: string) {
    const imageReference = ref(storage, url);
    return await getDownloadURL(imageReference);
}

export async function uploadImage(file: File) {
    const imageId = v4();
    const imageRef = ref(storage, `images/avatar/${imageId}`);
    const snapshot = await uploadBytes(imageRef, file);
    return snapshot.ref.fullPath;
}

export async function deleteImage(url: string) {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
}

