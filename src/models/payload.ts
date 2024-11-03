import { UserRole } from "./role";

export interface Payload {
    id: string;
    username: string;
    role: UserRole;
    avatarUrl?: string;
}