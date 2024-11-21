import { Content } from './content';
import { Base } from './base';

export interface Thread extends Base, Content {
    title: string;
    body: string;
    author?: {
        _id: string;
        displayName: string;
        avatarUrl: string;
    }
    box?: string;
    commentCount?: number;
}