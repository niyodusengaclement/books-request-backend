const languagesTable = `DROP TABLE IF EXISTS languages CASCADE; 
  CREATE TABLE IF NOT EXISTS languages (
    languageId SERIAL PRIMARY KEY,
    language VARCHAR(30) NOT NULL,
    languageCode VARCHAR(10) NOT NULL
    );

    INSERT INTO languages (language, languageCode) values
    ('kinyarwanda', 'RW'),
    ('english', 'US'),
    ('francais', 'FR')
  `;
const booksTable = `DROP TABLE IF EXISTS books CASCADE; CREATE TABLE IF NOT EXISTS
books (bookId SERIAL PRIMARY KEY,
      bookName VARCHAR(20) NOT NULL,
      bookReader VARCHAR(20) NOT NULL,
      bookType VARCHAR(30) NOT NULL,
      language INTEGER NOT NULL,
      price INTEGER NOT NULL
      );
      INSERT INTO books (bookName, bookReader, bookType, language, price) values
      ('bible_study', 'adult', 'Hard Cover', '1', '1850'),
      ('bible_study', 'adult', 'Soft Cover', '1', '350'),
      ('bible_study', 'adult', 'Hard Cover', '3', '1700'),
      ('bible_study', 'adult', 'Hard Cover', '2', '1850'),
      ('bible_study', 'young', '13-20', '1', '1850'),
      ('bible_study', 'young', '4-5', '1', '350'),
      ('bible_study', 'young', '21+', '3', '1500'),
      ('bible_study', 'young', '0-3', '2', '1000'),
      ('bible_study', 'young', '4-5', '2', '1000'),
      ('bible_study', 'young', '6-12', '2', '1000'),
      ('mission_report', 'adult', 'Soft Cover', '1', '280'),
      ('mission_report', 'young', 'Soft Cover', '1', '280')
      `;

const createCommand = `DROP TABLE IF EXISTS command CASCADE; CREATE TABLE IF NOT EXISTS
command (id SERIAL PRIMARY KEY,
      pastorid VARCHAR(50) NOT NULL,
      churchid INTEGER NOT NULL,
      category VARCHAR(20) NOT NULL,
      command json,
      year INTEGER NOT NULL,
      term INTEGER NOT NULL,
      time timestamp NOT NULL DEFAULT NOW()
      );`;
// const insertChurches = `\copy churches (field, zone, district, church_name, pastor_code) FROM './public/ECRF.csv' DELIMITER ',' CSV HEADER `;

const pastorsTable = `DROP TABLE IF EXISTS pastors CASCADE; CREATE TABLE IF NOT EXISTS
pastors (id SERIAL PRIMARY KEY,
      login_code VARCHAR(50) NOT NULL UNIQUE,
      pastor_name VARCHAR(50) NOT NULL,
      isactive BOOLEAN DEFAULT false
      );
      INSERT INTO pastors (login_code, pastor_name) values
      ('001002003', 'MISTICO Clement'),
      ('001002004', 'IRANKUNDA Jolie')
      `;

const churchesTable = `DROP TABLE IF EXISTS churches CASCADE; CREATE TABLE IF NOT EXISTS
churches (church_id SERIAL PRIMARY KEY,
      pastor_code VARCHAR(50) NOT NULL,
      field VARCHAR(20) NOT NULL,
      zone VARCHAR(50) NOT NULL,
      district VARCHAR(50) NOT NULL,
      church_name VARCHAR(50) NOT NULL
      );
      INSERT INTO churches (pastor_code, field, zone, district, church_name) values
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'kayumba'),
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'maranyundo'),
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'gatare')
      `;

const usersTable = `DROP TABLE IF EXISTS users CASCADE; CREATE TABLE IF NOT EXISTS
users (id SERIAL PRIMARY KEY,
      id_code VARCHAR(20),
      names VARCHAR(50) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(30) NOT NULL,
      field VARCHAR(30)
      );
      INSERT INTO users (id_code, names, username, password, role, field) values
      ('', 'Mistico Clement', 'Mistico', '$2a$10$RwXlrDMQQ93QAm01.3RnKeFhhup8iXUDfuKpUNyPADpgjgrA2381.', 'admin', 'all'),
      ('', 'Irankunda Jolie', 'Jolie', '$2a$10$RwXlrDMQQ93QAm01.3RnKeFhhup8iXUDfuKpUNyPADpgjgrA2381.', 'field', 'ECRF')
      `;

const timeTable = `DROP TABLE IF EXISTS timetable CASCADE; CREATE TABLE IF NOT EXISTS
timetable (id SERIAL NOT NULL,
      term INTEGER NOT NULL,
      year INTEGER NOT NULL,
      startDate timestamp NOT NULL,
      endDate timestamp NOT NULL,
      PRIMARY KEY (term, year)
      );
      
      INSERT INTO timetable (term, year, startDate, endDate) values (1, 1890, '1890-05-10', '1890-05-10')`;

const otherBooks = `DROP TABLE IF EXISTS otherbooks CASCADE; CREATE TABLE IF NOT EXISTS
otherbooks (bookid SERIAL PRIMARY KEY,
      bookName VARCHAR(20) NOT NULL,
      description TEXT NOT NULL,
      language INTEGER NOT NULL,
      price INTEGER NOT NULL
      );`;

const otherBooksRequest = `DROP TABLE IF EXISTS otherbooksrequest CASCADE; CREATE TABLE IF NOT EXISTS
otherbooksrequest (id SERIAL PRIMARY KEY,
      pastorid VARCHAR(50) NOT NULL REFERENCES pastors(login_code) ON DELETE CASCADE,
      churchid INTEGER NOT NULL REFERENCES churches(church_id) ON DELETE CASCADE,
      bookid INTEGER NOT NULL,
      request INTEGER NOT NULL,
      delivered BOOLEAN DEFAULT false,
      time timestamp NOT NULL DEFAULT NOW()
      );`;

export {
  booksTable,
  createCommand,
  pastorsTable,
  churchesTable,
  usersTable,
  languagesTable,
  timeTable,
  otherBooks,
  otherBooksRequest,
};
