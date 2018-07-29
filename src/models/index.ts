
export interface Member {
  memberToken: string;
  name: string;
  phone: string;
  regDate?: Date;
}

export interface ReqMemberUpdate { 
  memberNo: number;
  name: string;
  phone: string;
}

export { MemberModel } from './member-model';