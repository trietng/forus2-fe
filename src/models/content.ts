import { Base } from "./base";
import { UserRole } from "./role";
import { Visibility } from "./visibility";

export interface Content extends Base, Visibility {
    title?: string;
    body: string;
    author?: {
        _id: string;
        displayName: string;
        avatarUrl: string;
        role: UserRole;
    }
    score?: number;
    voteStatus?: number;
}