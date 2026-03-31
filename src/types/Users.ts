export interface IChasescrollUser {
    id: string;
    createdOn: Date;
    userId: string;
    email: string;
    showEmail: string | null;
    firstName: string;
    active: boolean;
    lastName: string;
    publicProfile: boolean;
    username: string;
    type: string | null;
    dob: string | null;
    data: Record<string, any>;
    isDeleted: boolean | null;
    isSuspended: boolean | null;
}