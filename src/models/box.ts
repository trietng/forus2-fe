import { atom } from 'nanostores';
import { Base } from './base';

export interface Box extends Base {
    name: string;
    description: string;
    group?: {
        _id: string;
        name: string;
    }
    threads?: any[];
    moderators?: string[];
    threadCount?: number;
    subscriberCount?: number;
    subscriberStatus?: boolean;
}

export const $box = atom<Box | undefined>();