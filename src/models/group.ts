import { atom } from "nanostores";
import { Base } from "./base";
import { Box } from "./box";

export interface Group extends Base {
    name: string;
    boxes?: Box[];
}

export const $groups = atom<Group[] | undefined>();