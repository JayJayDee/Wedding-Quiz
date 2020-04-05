import { Member } from './member';
import { Quiz } from './quiz';
import { QuizChoice } from './quiz-choice';
import { Play } from './play';

export const Entities =
  () => [
    Member,
    Quiz, QuizChoice,
    Play
  ];

export {
  Member,
  Quiz, QuizChoice,
  Play
};
