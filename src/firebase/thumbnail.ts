import { getDownloadURL, ref } from "firebase/storage";
import { db } from "../dexie/config";
import { storage } from "./config";
import { api } from "../api";
import { readAsDataURLAsync } from "../helpers/filereader";

export async function getThumbnail(url: string, height: number) {
    console.log('url', url);
    const id = url.split('/').pop();
    console.log('id', id);
    if (!id) {
        return null;
    }
    let thumbnail = await db.thumbnails.get(`${id}+${height}`);
    if (!thumbnail) {
        const imageRef = ref(storage, url);
        const downloadURL = await getDownloadURL(imageRef);
        const response = await api.get(`v1/resize/?url=${encodeURIComponent(downloadURL)}&height=${height}`, { responseType: 'arraybuffer' });
        thumbnail = {
            id: `${id}+${height}`,
            data: new Blob([response.data], { type: response.headers["content-type"] }),
        }
        await db.thumbnails.put(thumbnail);
    }
    return await readAsDataURLAsync(thumbnail.data);
}