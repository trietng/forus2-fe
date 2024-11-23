import { Content } from "./content";

export interface Comment extends Content {
    replyTo?: string;
}