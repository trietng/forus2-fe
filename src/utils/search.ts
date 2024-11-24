export type SearchType = 'thread' | 'user' | 'box';
export type SearchDirection = 'asc' | 'desc';

export function route(q: string, type: string, page: number = 1, order: string = '', direction: string = 'desc') {
    let route = '/search';
    route += `/${page}`;
    route += `?q=${q}`;
    route += `&type=${type}`;
    const searchType = type as SearchType;
    switch (searchType) {
        case 'thread':
            order = 'updatedAt';
            break;
        case 'user':
            order = 'username';
            break;
        case 'box':
            order = 'name';
            break;
    }
    route += `&order=${order}`;
    route += `&direction=${direction}`;
    return route;
}