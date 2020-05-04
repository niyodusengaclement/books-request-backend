const languagesTable = `DROP TABLE IF EXISTS languages CASCADE; 
  CREATE TABLE IF NOT EXISTS languages (
    languageId SERIAL PRIMARY KEY,
    language VARCHAR(30) NOT NULL,
    languageCode VARCHAR(10) NOT NULL
    );

    INSERT INTO languages (language, languageCode) values
    ('kinyarwanda', 'KINY'),
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
      ('bible_study', 'adult', 'hard', '1', '1850'),
      ('bible_study', 'adult', 'soft', '1', '350'),
      ('bible_study', 'adult', 'hard', '3', '1700'),
      ('bible_study', 'adult', 'hard', '2', '1850'),
      ('bible_study', 'young', '13-20', '1', '1850'),
      ('bible_study', 'young', '4-5', '1', '350'),
      ('bible_study', 'young', '21+', '3', '1500'),
      ('bible_study', 'young', '0-3', '2', '1000'),
      ('bible_study', 'young', '4-5', '2', '1000'),
      ('bible_study', 'young', '6-12', '2', '1000'),
      ('mission_report', 'adult', 'soft', '1', '280'),
      ('mission_report', 'young', 'soft', '1', '280')
      `;

const createCommand = `DROP TABLE IF EXISTS command CASCADE; CREATE TABLE IF NOT EXISTS
command (id SERIAL PRIMARY KEY,
      bookId INTEGER NOT NULL,
      pastor VARCHAR(50) NOT NULL REFERENCES pastors(login_code) ON DELETE CASCADE,
      church VARCHAR(50) NOT NULL REFERENCES churches(church_id) ON DELETE CASCADE,
      command json[],
      year INTEGER NOT NULL,
      term INTEGER NOT NULL,
      time timestamp NOT NULL DEFAULT NOW()
      );`;

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
churches (id SERIAL PRIMARY KEY,
      pastor_code VARCHAR(50) NOT NULL REFERENCES pastors(login_code) ON DELETE CASCADE,
      field VARCHAR(20) NOT NULL,
      zone VARCHAR(50) NOT NULL,
      district VARCHAR(50) NOT NULL,
      church_name VARCHAR(50) NOT NULL,
      church_id VARCHAR(50) NOT NULL UNIQUE
      );
      INSERT INTO churches (pastor_code, field, zone, district, church_name, church_id) values
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'kayumba', 'kay123'),
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'maranyundo', 'mar123'),
      ('001002003', 'ECRF', 'nyamata', 'nyamata', 'gatare', 'gat123')
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
      ('', 'Irankunda Jolie', 'Jolie', '$2a$10$RwXlrDMQQ93QAm01.3RnKeFhhup8iXUDfuKpUNyPADpgjgrA2381.', 'field', 'ecrf')
      `;
export {
  booksTable,
  createCommand,
  pastorsTable,
  churchesTable,
  usersTable,
  languagesTable,
};
