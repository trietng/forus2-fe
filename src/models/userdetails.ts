export interface ImmutableUserDetails {
    email: string;
    createdAt: Date;
}

export interface MutableUserDetails {
    displayName: string;
    description?: string;
    dateOfBirth?: Date;
}