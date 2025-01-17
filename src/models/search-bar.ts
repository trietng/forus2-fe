import { map } from 'nanostores'

export const SearchBarTypeSet = <const> ['Thread', 'User', 'Box'];
export type SearchBarType = typeof SearchBarTypeSet[number];

export interface SearchBarState {
    type: SearchBarType;
}

export const $searchBarState = map<SearchBarState>({
    type: 'Thread'
});