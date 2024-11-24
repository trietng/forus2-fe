import { Box } from "./box";
import { Thread } from "./thread";
import { User } from "./user";

export interface SearchResult {
    metadata: {
        total: number;
        pageCount: number;
    };
    threads?: Thread[];
    boxes?: Box[];
    users?: User[];
}