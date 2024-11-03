import Dexie, { type EntityTable } from 'dexie';
import { Thumbnail } from '../models/thumbnail';

const db = new Dexie("ForUS") as Dexie & {
    thumbnails: EntityTable<Thumbnail, "id">;
};

db.version(1).stores({
    thumbnails: "id, data"
});

export { db };