import { atom } from 'nanostores';
import { Base } from './base';

export interface Box extends Base {
    name: string;
    description: string;
    threads?: any[];
}

export interface BoxWithCount extends Box {
    threadCount?: number;
    subscriberCount?: number;
}

export const $box = atom<Box | undefined>();