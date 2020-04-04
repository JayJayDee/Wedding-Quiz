import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, OneToMany } from 'typeorm';
import { Play } from './play';

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

  @OneToMany(() => Play, (play) => play.member)
  public plays: Play[];
}
