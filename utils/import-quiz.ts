import 'dotenv/config';
import { getConnection } from 'typeorm';
import { exit } from 'process';
import { resolve } from 'path';
import { argv } from 'yargs';
import * as XLSX from 'xlsx';

import { logger } from '../src/logger';
import { initMysqlConnection } from '../src/mysql-connector';
import { Quiz } from '../src/entities/quiz';
import { QuizChoice } from '../src/entities/quiz-choice';

const log = logger({ tag: 'import-quiz' });

(async () => {
  log.info('starting import ...');
  const { filePath } = argv;
  if (!filePath) {
    log.error('error! invalid parameter.');
    log.error('usage: node import-quiz.js --filePath=test-excel.xls');
    exit(0);
  }

  // 1. import excel first
  const excelFilePath = resolve(filePath as string);
  const workbook = XLSX.readFile(excelFilePath);
  const sheet = workbook.Sheets.Sheet1;
  const rawQuizzesFromSheet = XLSX.utils.sheet_to_json(sheet) as any[];
  log.info(`excel loaded: ${excelFilePath}`);

  await initMysqlConnection({
    logging: true
  });

  // 2. import to DB
  log.info(`importing quizzes...`);
  let numImported = 0;
  await getConnection().transaction(async (mgr) => {
    const quizRepo = mgr.getRepository(Quiz);
    const choiceRepo = mgr.getRepository(QuizChoice);

    for (const raw of rawQuizzesFromSheet) {
      const quiz = quizRepo.create({
        question: raw['문제']
      });
      const newQuiz = await quizRepo.save(quiz);
      const rawChoices = [
        {
          choiceText: raw['1번'],
          correct: raw['답'] === '1번' ? true : false
        },
        {
          choiceText: raw['2번'],
          correct: raw['답'] === '2번' ? true : false
        },
        {
          choiceText: raw['3번'],
          correct: raw['답'] === '3번' ? true : false
        },
        {
          choiceText: raw['4번'],
          correct: raw['답'] === '4번' ? true : false
        }
      ];

      const choices =
        rawChoices.map((choice) =>
          choiceRepo.create({
            ...choice,
            quizNo: newQuiz.no
          }));
      await choiceRepo.save(choices);

      numImported++;
    }
  });

  log.info(`import completed, all ${numImported} quizzes.`);
  exit(0);
})();
