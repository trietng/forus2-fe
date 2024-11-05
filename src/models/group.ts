import { atom } from "nanostores";
import { Base } from "./base";
import { BoxWithCount } from "./box";

export interface Group extends Base {
    name: string;
    boxes?: BoxWithCount[];
}

export const $groups = atom<Group[] | undefined>();