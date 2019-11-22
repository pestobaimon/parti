export interface partiUser {
    uid: string;
    displayName?: string;
    email?: string;
    friends?: Array<partiUser>;
    groups?: Array<partiGroup>;
}
export interface partiGroup {
    groupName: string;
    members: Array<partiUser>;
}
export interface parties {
    partyId: string;
    partyName: string;
    partyType: string;
    partyLeader: partiUser;
    minMembers: number;
    maxMembers?: number;
    memberCount:number;
    groups?: Array<partiGroup>;
    friends?: Array<partiUser>;
    time: Date;
    exptime: Date;
    place: string;
}