
export interface Member {
  member_token: string;
  name: string;
  phone: string;
  regDate?: Date;
}

export interface ReqMemberCreate { 
  name: string;
  phone: string;
}

export { MemberModel } from './member-model';