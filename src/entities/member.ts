import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

@Entity()
@Unique([ 'name', 'phone' ])
export class Member {

  @PrimaryGeneratedColumn()
  public no: number;

  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column()
  public email: string;

  @CreateDateColumn({
    type: 'timestamp'
  })
  public regDate: Date;
}
