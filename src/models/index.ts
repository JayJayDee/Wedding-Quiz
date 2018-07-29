
export interface Member {
  member_token: string;
  name: string;
  phone: string;
  regDate?: Date;
}

export interface ReqMemberUpdate { 
  member_no: number;
  name: string;
  phone: string;
}

export { MemberModel } from './member-model';