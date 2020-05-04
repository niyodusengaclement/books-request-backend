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

  async createCommand(values) {
    const text = `INSERT INTO command (book, category, command, pastor, church, year, term)
    values ($1, $2, $3, $4, $5, $6, $7) returning *`;
    const { rows } = await db.query(text, values);
    return rows[0];
  }

  async commandPerChurch(church, year, term){
    const { rows } = await db.query('SELECT id, category, year, term, command command FROM command WHERE church = $1 AND year = $2 AND term = $3', [church, year, term]);
    return rows;
  }

  async commandPerPastor(pastor_code, year, term){
    const { rows } = await db.query('SELECT id, category, year, term, command command FROM command WHERE pastor = $1 AND year = $2 AND term = $3', [pastor_code, year, term]);
    return rows;
  }

  async findBooks(){
    const { rows } = await db.query('SELECT book, category, language, language_id, type, price FROM books');
    return rows;
  }

  async findLanguages(){
    const { rows } = await db.query('SELECT DISTINCT language, language_id as lang FROM books');
    return rows;
  }
}
export default new PastorsModel();
