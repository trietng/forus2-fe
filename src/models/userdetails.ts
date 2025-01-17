export interface ImmutableUserDetails {
    email: string;
    createdAt: string;
}

export interface MutableUserDetails {
    displayName: string;
    description?: string;
    dateOfBirth?: string;
}