import { map } from 'nanostores'

export type SearchBarType = 'Thread' | 'User' | 'Box';
export interface SearchBarState {
    type: SearchBarType;
}

export const $searchBarState = map<SearchBarState>({
    type: 'Thread'
});