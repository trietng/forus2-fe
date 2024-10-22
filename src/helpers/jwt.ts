import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Payload } from '../models/payload';

export function getDecodedPayload() : Payload | undefined {
    const headerPayload = Cookies.get('headerPayload');
    if (headerPayload) {
        const decoded = jwtDecode(headerPayload);
        if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
            const sub = decoded as Payload;
            return {
                id: sub.id,
                username: sub.username,
                role: sub.role
            };
        }
    }
}