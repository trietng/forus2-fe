import { Content } from './content';
import { Base } from './base';
import { Visibility } from './visibility';

export interface Thread extends Base, Content, Visibility {
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