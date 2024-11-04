import { atom } from "nanostores";
import { Base } from "./base";
import { BoxWithThreadCount } from "./box";

export interface Group extends Base {
    name: string;
    boxes?: BoxWithThreadCount[];
}

export const $groups = atom<Group[] | undefined>();