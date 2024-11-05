import { Base } from './base';
import { Content } from './content';

export interface Box extends Base, Content {
    name: string;
    description: string;
}

export interface BoxWithThreadCount extends Box {
    threadCount?: number;
}