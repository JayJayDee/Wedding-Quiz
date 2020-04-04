import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Quiz {

  @PrimaryGeneratedColumn()
  public no: number;

  @Column({
    length: 200
  })
  public question: string;
}
