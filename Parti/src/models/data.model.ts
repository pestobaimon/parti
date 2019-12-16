export interface partiUser {
    uid: string;
    displayName: string;
    email: string;
    friends?: any [];
    friendIds?: string [];
    profilePic?:string;
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
    maxMembers: any;
    memberCount:number;
    pendingMemberCount:number;
    groupNames?: Array<string>;
    groupIds?:Array<string>;
    pendingMembers: Array<any>;
    pendingMemberIds:Array<string>;
    members: Array<any>;
    memberIds:Array<any>;
    time: Date;
    exptime: any;
    place: string;
    isFull:boolean;
    isExpired:boolean;
}