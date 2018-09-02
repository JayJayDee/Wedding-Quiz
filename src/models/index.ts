import { BaseLogicalError } from '../rest-endpoints/errors';

export class InvalidMemberStatusError extends BaseLogicalError {
  constructor(detail: string) {
    super('INVALID_MEMBER_STATUS', detail);
  }
}

export class QuizSolveFailError extends BaseLogicalError {
  constructor(detail: string) {
    super('QUIZ_SOLVE_FAIL', detail);
  }
}

export class QuizInvalidChoiceError extends BaseLogicalError {
  constructor(choiceNo: number) {
    super('INVALID_CHOICE', `invalid choice for choice_no:${choiceNo}`);
  }
}

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
export interface QuizStatus {
  num_all_quiz: number;
  num_played: number;
  num_correct: number;
  num_incorrect: number;
  score_sum: number;
  is_ended: boolean;
}
export interface QuizQuestion {
  question_no: number;
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
export interface RankElement {
  rank: number;
  name: string;
  phone: string;
  win_count: number;
  play_time: number;
  score_sum: number;
}
export interface MyRank {
  rank: number;
  challengers: number;
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
  is_win: boolean;
  correct_answer: string;
  answer_description: string;
  gain_score: number;
}

export interface QuizResult {
  quiz_no: number;
  is_win: boolean;
  is_played: boolean;
}

export { MemberModel } from './member-model';
export { QuizPoolModel } from './quiz-pool-model';
export { PlayModel } from './play-model';
export { RankModel } from './rank-model';