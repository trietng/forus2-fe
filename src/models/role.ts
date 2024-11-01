export const UserRoleSet = <const> ['ROLE_ADMIN', 'ROLE_USER'];
export type UserRole = typeof UserRoleSet[number];
export const UserRoleMap = <const> { 'ROLE_ADMIN': 'admin', 'ROLE_USER': 'user' };