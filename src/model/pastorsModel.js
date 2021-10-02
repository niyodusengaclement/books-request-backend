import db from '../database/db';

class PastorsModel {
  async findUserByUsername(username) {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  async findUserByCode(login_code) {
    const { rows } = await db.query('SELECT * FROM users WHERE id_code = $1', [login_code]);
    return rows[0];
  }

  async findPastor(login_code) {
    const { rows } = await db.query('SELECT * FROM pastors WHERE login_code = $1', [login_code]);
    return rows[0];
  }

  async findChurchesPerPastor(login_code) {
    const { rows } = await db.query('SELECT * FROM churches WHERE pastor_code = $1', [login_code]);
    return rows;
  }
  
  async createAccount(values) {
    const text = `INSERT INTO users (id_code, names, username, password, role)
    values ($1, $2, $3, $4, $5) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async activateAccount(values) {
    const text = `UPDATE pastors SET isActive = $2 WHERE login_code = $1  returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async commandIsExist(values) {
    const text = `SELECT * FROM command WHERE pastorid = $1 AND churchid = $2 AND category = $3 AND year = $4 AND term = $5`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async createCommand(values) {
    const text = `INSERT INTO command (pastorid, churchid, command, year, term, category, name)
    values ($1, $2, $3, $4, $5, $6, $7) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async createOtherBooksRequest(values) {
    const text = `INSERT INTO otherbooksrequest (pastorid, churchid, bookid, request)
    values ($1, $2, $3, $4) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async commandPerChurch(church, year, term){
    const { rows } = await db.query(`select pastor_name, command.name, church_name, (book->>'bookid')::integer as bookid, bookname, bookreader, booktype, languages.language, (book->>'number')::integer as nbr,((book->>'number')::integer * price) as price, year, term, time  from command, books, languages, pastors,churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code AND churchid = $1 AND year = $2 AND term = $3`, [church, year, term]);
    return rows;
  }

  async commandPerPastor(pastor_code, year, term){
    const { rows } = await db.query(`select pastor_name, command.name, church_name, (book->>'bookid')::integer as bookid, bookname, bookreader, booktype, languages.language, (book->>'number')::integer as nbr,((book->>'number')::integer * price) as price, year, term, time  from command, books, languages, pastors,churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code AND pastorid = $1 AND year = $2 AND term = $3`, [pastor_code, year, term]);

    return rows;
  }

  async findAllRequests() {
    const { rows } = await db.query(`select pastor_name, command.name, field, zone, district, church_name, (book->>'bookid')::integer as bookid, bookname, bookreader, booktype, languages.language, (book->>'number')::integer as nbr,((book->>'number')::integer * price) as price, year, term, time  from command, books, languages, pastors,churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code`);

    return rows;
  }

  async findChurchRequests(pastor_code, year, term){
    const { rows } = await db.query(`select id, churchid, command.name, bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, languages, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND books.language = languages.languageid AND command.pastorid = $1 AND year = $2 AND term = $3 GROUP BY id, churchid, bookid, bookname, bookreader, languages.language ORDER BY bookid ASC`, [pastor_code, year, term]);

    return rows;
  }
  
  async findPastorTotalRequestsByBook(pastor_code, year, term){
    const { rows } = await db.query(`select bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, languages, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND books.language = languages.languageid AND command.pastorid = $1 AND pastorid = $1 AND year = $2 AND term = $3  GROUP BY bookid, bookname, bookreader, languages.language order by bookid`, [pastor_code, year, term]);

    return rows;
  }
    
  async findFieldTotalRequestsByBook(year, term) {
    const { rows } = await db.query(`select field, (book->>'bookid')::integer as bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) as nbr, SUM(((book->>'number')::integer * price)) as price from command, books, languages, pastors, churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code AND year = $1 AND term = $2 group by (book->>'bookid')::integer, field, bookname, bookreader, languages.language, booktype ORDER BY bookid`, [year, term]);

    return rows;
  }

  async findCertainFieldTotalRequests(field, year, term) {
    const { rows } = await db.query(`select (book->>'bookid')::integer as bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) as nbr, SUM(((book->>'number')::integer * price)) as price from command, books, languages, pastors, churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code AND churches.field = $1 AND year = $2 AND term = $3 group by (book->>'bookid')::integer, bookname, bookreader, languages.language, booktype ORDER BY bookid`, [field, year, term]);

    return rows;
  }

  async findDistrictsRequests(field, year, term) {
    const { rows } = await db.query(`select (book->>'bookid')::integer as bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) as nbr, SUM(((book->>'number')::integer * price)) as price, district from command, books, languages, pastors, churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND languages.languageid = books.language AND churches.church_id = command.churchid AND command.pastorid = pastors.login_code AND churches.field = $1 AND year = $2 AND term = $3 group by (book->>'bookid')::integer, district, bookname, bookreader, languages.language, booktype ORDER BY bookid`, [field, year, term]);

    return rows;
  }

  async findUnionTotalRequestsByBook(year, term){
    const { rows } = await db.query(`select bookid, bookname, bookreader, languages.language, booktype, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, languages, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND books.language = languages.languageid AND year = $1 AND term = $2 GROUP BY bookid, bookname, bookreader, languages.language order by bookid`, [year, term]);

    return rows;
  }

  async findTotalNumbersByPastor(pastor_code, year){
    const { rows } = await db.query(`select bookname, bookreader, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND year = $2 AND pastorid = $1 GROUP BY bookname, bookreader ORDER BY bookname`, [pastor_code, year]);

    return rows;
  }

  async findTotalNumbersByField(field, year){
    const { rows } = await db.query(`select bookname, bookreader, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, churches, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND churches.church_id = command.churchid AND churches.field = $1 AND year = $2 GROUP BY bookname, bookreader ORDER BY bookname`, [field, year]);

    return rows;
  }

  async findTotalNumbersByUnion(year){
    const { rows } = await db.query(`select bookname, bookreader, SUM((book->>'number')::integer) AS nbr, sum(((book->>'number')::integer * price)) AS price from command, books, json_array_elements(command->'request') book where books.bookid = (book->>'bookid')::integer AND year = $1 GROUP BY bookname, bookreader ORDER BY bookname`, [year]);

    return rows;
  }

  async updateChurchRequest(command, id){
    const { rows } = await db.query(`UPDATE command SET command = $1 WHERE id = $2`, [command, id]);

    return rows;
  }

  async deliverBooks(id){
    const { rows } = await db.query(`UPDATE otherbooksrequest SET delivered = true WHERE id = $1`, [id]);

    return rows;
  }

  async findBooks(){
    const { rows } = await db.query('SELECT bookid,  bookname, bookreader, booktype, languages.language, languages.languageid, languagecode, price FROM books, languages WHERE languages.languageid = books.language ORDER BY languages.languageid');
    return rows;
  }

  async findOtherBooks(){
    const { rows } = await db.query('SELECT bookid,  bookname, description, languages.language, languages.languageid, price FROM otherbooks, languages WHERE languages.languageid = otherbooks.language');
    return rows;
  }

  async findLanguages(){
    const { rows } = await db.query('SELECT languageid, language, languagecode from languages');
    return rows;
  }

  async requestDetails(id){
    const { rows } = await db.query(`SELECT * FROM command WHERE id = ${id}`);
    return rows[0];
  }

  async findDistricts(field){
    const { rows } = await db.query(`SELECT district, login_code as pastor_code FROM churches, pastors WHERE field=$1 AND login_code = pastor_code GROUP BY district, login_code`, [field]);
    return rows;
  }

  async findFieldChurches(field){
    const { rows } = await db.query(`SELECT church_id, pastor_name, field, zone, district, church_name FROM churches, pastors WHERE churches.pastor_code = pastors.login_code AND field = '${field}' ORDER BY church_id `);
    return rows;
  }

  async findAllFields(){
    const { rows } = await db.query(`SELECT DISTINCT(field) FROM churches ORDER BY field`);
    return rows;
  }

  async findAllChurches(){
    const { rows } = await db.query(`SELECT church_id, field, zone, district, church_name FROM churches ORDER BY church_id`);
    return rows;
  }

  async doesTimetableExist(term, year) {
    const { rows } = await db.query(`SELECT * FROM timetable WHERE term = ${term} AND year = ${year}`);
    return rows[0];
  }

  async createTimetable(values) {
    const text = `UPDATE timetable SET term = $1 , year = $2, startDate = $3, endDate = $4 WHERE id = 1 returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async checkTimetable() {
    const text = `SELECT * FROM timetable`;
    const { rows } = await db.query(text);
    return rows;
  }

  async PastorOtherBooksRequests(pastor_id) {
    const text = `SELECT id, otherbooksrequest.bookid, bookname, description, languages.language, field, zone, district, church_name, otherbooksrequest.request, otherbooks.price as price, otherbooks.price * otherbooksrequest.request AS totalPrice, delivered, otherbooksrequest.time FROM otherbooksrequest, churches, languages, otherbooks WHERE otherbooksrequest.bookid = otherbooks.bookid AND languages.languageid = otherbooks.language AND otherbooksrequest.churchid = churches.church_id AND pastorid = '${pastor_id}'  ORDER BY delivered ASC`;
    
    const { rows } = await db.query(text);
    return rows;
  }

  async FieldOtherBooksRequests(field) {
    const text = `SELECT id, otherbooksrequest.bookid, bookname, description, languages.language, field, zone, district, church_name, otherbooksrequest.request, otherbooks.price as price, otherbooks.price * otherbooksrequest.request AS totalPrice, delivered, otherbooksrequest.time FROM otherbooksrequest, churches, languages, otherbooks WHERE otherbooksrequest.bookid = otherbooks.bookid AND languages.languageid = otherbooks.language AND otherbooksrequest.churchid = churches.church_id AND field = '${field}'  ORDER BY delivered ASC`;
    
    const { rows } = await db.query(text);
    return rows;
  }

  async UnionOtherBooksRequests() {
    const text = `SELECT id, otherbooksrequest.bookid, bookname, description, languages.language, field, zone, district, church_name, otherbooksrequest.request, otherbooks.price as price, otherbooks.price * otherbooksrequest.request AS totalPrice, otherbooksrequest.time FROM otherbooksrequest, churches, languages, otherbooks WHERE otherbooksrequest.bookid = otherbooks.bookid AND languages.languageid = otherbooks.language AND otherbooksrequest.churchid = churches.church_id ORDER BY id DESC`;
    
    const { rows } = await db.query(text);
    return rows;
  }

  async findYears() {
    const text = `SELECT DISTINCT(year) FROM command ORDER BY year ASC`;
    const { rows } = await db.query(text);
    return rows;
  }

  async addBook(values) {
    const text = `INSERT INTO books (bookname, bookreader, booktype, language, price)
    values ($1, $2, $3, $4, $5) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async addOtherBook(values) {
    const text = `INSERT INTO otherbooks (bookname, description, language, price)
    values ($1, $2, $3, $4) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async uploadPastors(values) {
    const text = `INSERT INTO pastors (login_code, pastor_name)
    values ($1, $2) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async addChurch(values) {
    const text = `INSERT INTO churches (pastor_code, field, zone, district, church_name)
    values ($1, $2, $3, $4, $5) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async addPastor(values) {
    const text = `INSERT INTO pastors (login_code, pastor_name)
    values ($1, $2) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async findPastors() {
    const { rows } = await db.query(`SELECT * FROM pastors`);
    return rows;
  }

}
export default new PastorsModel();
