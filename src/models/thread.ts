import { Base } from './base';

export interface Thread extends Base {
    title: string;
    body: string;
    author?: string;
    box?: string;
}