import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quiz } from './quiz';

@Entity()
export class QuizChoice {

  @PrimaryGeneratedColumn()
  public no: number;

  @Column()
  public quizNo: number;

  @Column({
    length: 50
  })
  public choiceText: string;

  @Column()
  public correct: boolean;

  @ManyToOne((type) => Quiz, (quiz) => quiz.choices)
  @JoinColumn({ referencedColumnName: 'quizNo' })
  public quiz: Quiz;
}