
import db from '../databases';
import { Member, ReqMemberCreate } from './index';
import log from '../loggers';

export const MemberModel = {
  
  insertNewMember: async function(member: ReqMemberCreate): Promise<number> {
    let query: string = 
    `
      INSERT INTO 
        wedd_member 
        (name, phone, reg_date) 
      SELECT 
        ?, ?, NOW() 
      WHERE 
        ? NOT IN (SELECT phone FROM wedd_member)
    `;
    let params: any[] = [member.name, member.phone, member.phone];
    let resp: any = await db.query(query, params);
    if (resp.affectedRows === 0) return null;
    let memberNo: number = resp.insertId;
    return memberNo;
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