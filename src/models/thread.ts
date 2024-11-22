import { Content } from './content';
import { Base } from './base';
import { atom } from 'nanostores';
import { Box } from './box';
import { Group } from './group';

export interface Thread extends Base, Omit<Content, "title"> {
    title: string;
    box?: Box & {
        group?: Group;
    }
    commentCount?: number;
    pageCount?: number;
}

export const $thread = atom<Thread | undefined>();