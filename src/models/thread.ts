import { Content } from './content';
import { Box } from './box';
import { Group } from './group';
import { Comment } from './comment';

export interface Thread extends Omit<Content, "title"> {
    title: string;
    box?: Box & {
        group?: Group;
    }
    commentCount?: number;
    comments: Comment[];
    pageCount?: number;
}