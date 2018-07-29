
import db from '../databases';
import { Member, ReqMemberUpdate } from './index';
import log from '../loggers';

export const MemberModel = {
  insertNewMember: async function (memberToken: string): Promise<number> {
    let query: string = 
    `
      INSERT INTO 
        wedd_member 
      SET 
        member_token=?
    `;
    let params: any[] = [memberToken];
    let resp: any = await db.query(query, params);
    let memberNo: number = resp.insertId;
    return memberNo;
  },

  updateMember: async function(member: ReqMemberUpdate): Promise<any> {
    //TODO: update member information which has member_no
  },

  getMember: async function(memberNo: number): Promise<Member> {
    let query: string = 
    `
      SELECT 
        * 
      FROM 
        wedd_member
      WHERE 
        no=?
    `;
    let params: any[] = [memberNo];
    let rows: any[] = await db.query(query, params);
    if (rows.length === 0) {
      return null;
    }

    let member: Member = {
      member_token: rows[0]['member_token'],
      name: rows[0]['name'],
      phone: rows[0]['phone']
    };
    return member;
  }
}