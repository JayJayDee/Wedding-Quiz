import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Play } from './play';
import { QuizChoice } from './quiz-choice';

@Entity()
export class Quiz {

  @PrimaryGeneratedColumn()
  public no: number;

  @Column({
    length: 200
  })
  public question: string;

  @OneToMany(() => Play, (play) => play.quiz)
  public plays: Play[];

  @OneToMany(() => QuizChoice, (choice) => choice.quiz)
  public choices: QuizChoice[];
}
