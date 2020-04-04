# Wedding-Quiz-Server
An application server for simple quiz. At my wedding, I used it to give guests a quiz with a smartphone and pay prizes according to their ranking. this is reason why name of this quiz application is `WeddingQuiz`.

## Requirements
- node 12.x or above
- MySQL or MariaDB

## How to run (for development)
```bash
npm install
npm run util:sync  # for prepare MySQL table schema.
npm run dev
```

## Configurations
this application uses `dotenv`. so, an example for `.env` file will be same as followings:

```bash
HTTP_PORT=3000

DB_HOST=xxxxx
DB_PORT=3306
DB_USER=root
DB_PASSWORD=xxxx
DB_DATABASE=xxxx

JWT_PRIVATE_KEY=xxxx
```

## See also
- [WeddQuiz Frontend (vue.js)](https://github.com/JayJayDee/Wedding-Quiz-Frontend)