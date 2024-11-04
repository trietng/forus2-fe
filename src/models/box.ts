import { Base } from './base';

export interface Box extends Base {
    name: string;
    description: string;
}

export interface BoxWithThreadCount extends Box {
    threadCount?: number;
}