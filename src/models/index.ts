
export interface Member {
  member_token: string;
  name: string;
  phone: string;
  regDate?: Date;
}
export enum QuestionType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}
export interface QuizQuestion {
  no: number;
  content: string;
  type: QuestionType;
}
export interface QuizChoice {
  choice_no: number;
  content: string;
}
export interface Quiz {
  difficulty: number;
  questions: QuizQuestion[];
  choices: QuizChoice[];
}

export interface ReqMemberCreate { 
  name: string;
  phone: string;
}
export interface ReqSolveQuiz {
  member_no: number;
  choice_no: number;
}
export interface ResSolveQuiz {
  is_correct: boolean;
  ended: boolean;
  right_choice: string;
}

export { MemberModel } from './member-model';
export { QuizPoolModel } from './quiz-pool-model';
export { PlayModel } from './play-model';