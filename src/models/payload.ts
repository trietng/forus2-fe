import { UserRole } from "./role";

export interface Payload {
    id: string;
    username: string;
    displayName: string;
    role: UserRole;
    avatarUrl?: string;
}