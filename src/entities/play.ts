import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, OneToOne, AfterLoad, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Quiz } from './quiz';
import { Member } from './member';
import { QuizChoice } from "./quiz-choice";

@Entity()
export class Play {

  @PrimaryGeneratedColumn()
  public no: number;

  @Column({
    nullable: true
  })
  @Index()
  public quizNo?: number;

  @Column()
  @Index()
  public memberNo: number;

  @Column({
    nullable: true
  })
  public choiceNo?: number;

  @UpdateDateColumn({
    type: 'timestamp'
  })
  public solvedDate: Date;

  @CreateDateColumn({
    type: 'timestamp'
  })
  public regDate: Date;

  @ManyToOne(() => Quiz, (quiz) => quiz.plays, { nullable: true })
  @JoinColumn({ name: 'quizNo' })
  public quiz?: Quiz;

  @OneToOne(() => QuizChoice, { nullable: true })
  @JoinColumn({ name: 'choiceNo' })
  public choice?: QuizChoice;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberNo' })
  public member: Member;
}
