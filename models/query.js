const { pool } = require('./db');
const { generatePassword } = require('../passport/password');

async function getUser(email) {
  const SQL = `SELECT * FROM users WHERE email = $1`;
  const { rows } = await pool.query(SQL, [email]);
  return rows;
}

async function getAllMessages() {
  const SQL = `
  SELECT m.id, u.first_name, u.last_name, m.title, m.text, m.timestamp
  FROM users u JOIN messages m 
  ON u.id = m.user_id;
  `;
  const { rows } = await pool.query(SQL);
  return rows;
}

async function addNewUser(req) {
  const SQL = `INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)`;
  const hashedPassword = await generatePassword(req.body.password);
  await pool.query(SQL, [req.body.firstName, req.body.lastName, req.body.email, hashedPassword]);
}

async function addNewMessage(req) {
  const SQL = `INSERT INTO messages (title, timestamp, text, user_id) VALUES ($1, NOW(), $2, $3)`;
  await pool.query(SQL, [req.body.title, req.body.text, req.user.id]);
}

async function userMembershipOn(req) {
  const SQL = `UPDATE users SET is_member = true WHERE id = $1;`;
  await pool.query(SQL, [req.user.id]);
}

async function deleteMsg(req) {
  console.log(req.body);
  console.log(req.body.messageId);
  const SQL = `DELETE from messages WHERE id = $1`;
  await pool.query(SQL, [req.body.messageId]);
}

module.exports = {
  getUser,
  getAllMessages,
  addNewUser,
  addNewMessage,
  userMembershipOn,
  deleteMsg,
};
