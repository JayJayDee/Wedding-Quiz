
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
  no: number;
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
export interface ReqPickQuiz {
  member_no: number;
}

export { MemberModel } from './member-model';
export { QuizPoolModel } from './quiz-pool-model';