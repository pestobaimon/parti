import { DocumentReference } from 'angularfire2/firestore';

export interface partiUser {
    uid: string;
    displayName: string;
    email: string;
    friends?: any [];
    friendIds?: string [];
}
export interface partiGroup {
    groupName: string;  
    members: any [];
    groupId: string;
    creator: any;
    memberIds:string [];
}
export interface parties {
    partyId: string;
    partyName: string;
    partyType: string;
    partyLeader: partiUser;
    minMembers: number;
    maxMembers?: number;
    memberCount:number;
    groups?: Array<DocumentReference>;
    friends?: Array<DocumentReference>;
    time: Date;
    exptime: Date;
    place: string;
}