import { getDownloadURL, ref } from "firebase/storage";
import { murmurHash } from "ohash";
import { db } from "../dexie/config";
import { storage } from "./config";
import { readAsDataURLAsync } from "../helpers/filereader";
import { slience } from "../api/slience";

export async function getThumbnail(url: string, height: number) {
    const id = murmurHash(url);
    let thumbnail = await db.thumbnails.get(`generic+${id}+${height}`);
    if (!thumbnail) {
        try {
            const response = await slience.get(`v1/resize/?url=${encodeURIComponent(url)}&height=${height}`, { responseType: 'arraybuffer' });
            thumbnail = {
                id: `generic+${id}+${height}`,
                data: new Blob([response.data], { type: response.headers["content-type"] }),
            };
        } catch (error) {
            thumbnail = {
                id: `generic+${id}+${height}`,
                data: null
            };
        }
        await db.thumbnails.put(thumbnail);
    }
    if (thumbnail.data === null) {
        return url;
    }
    return await readAsDataURLAsync(thumbnail.data);
}

export async function getFirebaseThumbnail(url: string, height: number) {
    const id = url.split('/').pop();
    if (!id) {
        return null;
    }
    let thumbnail = await db.thumbnails.get(`firebase+${id}+${height}`);
    if (!thumbnail) {
        const imageRef = ref(storage, url);
        const downloadURL = await getDownloadURL(imageRef);
        try {
            const response = await slience.get(`v1/resize/?url=${encodeURIComponent(downloadURL)}&height=${height}`, { responseType: 'arraybuffer' });
            thumbnail = {
                id: `firebase+${id}+${height}`,
                data: new Blob([response.data], { type: response.headers["content-type"] }),
            };
        } catch (error) {
            thumbnail = {
                id: `firebase+${id}+${height}`,
                data: null
            };
        }
        await db.thumbnails.put(thumbnail);
    }
    if (thumbnail.data === null) {
        const imageRef = ref(storage, url);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    }
    return await readAsDataURLAsync(thumbnail.data);
}