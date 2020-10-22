// This file contains your database layer
//
//Implement updateQuestion, deleteQuestion
//Fix updateVote
//@ts-check
const dbPool = require('./pool');
const fs = require('fs');

async function rebuildDatabase() {
  const createDbScript = `${__dirname}/createdb.sql`;

  const sql = fs.readFileSync(createDbScript, 'utf8');
  return dbPool.query(sql);
}

async function addUser(makeUser) {
  var user = [
    makeUser.email,
    makeUser.username,
    makeUser.password,
    makeUser.lastname,
    makeUser.firstname,
    makeUser.admin
  ];
  let result = await dbPool.query(
    `INSERT INTO users (email, username, password, lastname, firstname, admin) VALUES (?)`,
    [user]
  );
  return result.insertId;
}

async function getUserById(userid) {
  return dbPool.query(`SELECT * FROM users WHERE id = ?`, [userid]);
}

async function getUserByName(username) {
  return dbPool.query(`SELECT * FROM users WHERE username = ?`, [username]);
}

async function setAdminState(adminState, id) {
  return dbPool.query(`UPDATE users SET admin = ? WHERE id = ?`, [adminState, id]);
}

async function listUsers(pgNum, limit) {
  if (isNaN(limit)) {
    limit = 5;
  }
  if (isNaN(pgNum)) {
    pgNum = 0;
  }
  let offset = pgNum * limit;
  return dbPool.query(`SELECT * FROM users LIMIT ? OFFSET ?`, [limit, offset]);
}

async function updateUser(id, partialUpdate) {
  return dbPool.query(`UPDATE users SET ? WHERE id = ?`, [partialUpdate, id]);
}

async function deleteUserById(id) {
  return dbPool.query(`DELETE FROM users WHERE id = ?`, [id]);
}

async function insertNewQuestion(question) {
  let q = await dbPool.query(
    `INSERT INTO questions (question, description, type) VALUES (?, ?, ?)`,
    [question.question, question.description, question.type]
  );
  let answers = [];
  for (var i = 0; i < question.choices.length; i++) {
    answers.push([q.insertId, question.choices[i]]);
  }
  await dbPool.query(
    `INSERT INTO answerchoices (questionid, description) VALUES ?`,
    [answers]
  );
  return q.insertId;
}

async function listQuestions(pgNum, limit) {
  if (isNaN(limit)) {
    limit = 5;
  }
  if (isNaN(pgNum)) {
    pgNum = 0;
  }
  let offset = pgNum * limit;
  return dbPool.query(`SELECT * FROM questions LIMIT ? OFFSET ?`, [limit, offset]);
}

async function getQuestion(questionid) {
  let resp = await dbPool.query(`SELECT * FROM questions WHERE id = ?`, [questionid]);
  let answers = await dbPool.query(`SELECT * FROM answerchoices WHERE questionid = ?`, [questionid]);
  if (resp[0] === undefined) {
    return false;
  }
  let choices = [];
  for (var i = 0; i < answers.length; i++) {
    choices.push({
      description: answers[i].description,
      id: answers[i].position
    });
  }
  let q = {
    description: resp[0].description,
    type: resp[0].type,
    question: resp[0].question
  };
  q.choices = choices;
  return q;
}

async function voteForQuestion(userid, questionid, answerchoiceid, deleteoldvote) {
  if (deleteoldvote) {
    await dbPool.query(
      `DELETE FROM votes WHERE userid = ? AND questionid = ?`,
      [userid, questionid]
    );
  }
  return dbPool.query(
    `INSERT INTO votes (userid, questionid, answerchoiceid) VALUES (?, ?, ?)`,
    [userid, questionid, answerchoiceid]
  );
}

async function getUserVotesForQuestion(userid, questionid) {
  let answer = await dbPool.query(`SELECT answerchoiceid FROM votes WHERE userid = ? AND questionid = ?`, [userid, questionid]);
  return [answer[0].answerchoiceid];
}

async function getVotesForQuestion(questionid) {
  let answer = await dbPool.query(`SELECT answerchoiceid FROM votes WHERE questionid = ?`, [questionid]);
  let choices = [];
  for (var i = 0; i < answer.length; i++) {
    if (!choices.includes(answer[i].answerchoiceid)) {
      choices.push(answer[i].answerchoiceid);
    }
  }

  let table = choices.map(q => ({
    choice: q,
    count: 0
  }));

  for (var k = 0; k < answer.length; k++) {
    for (var j = 0; j < table.length; j++) {
      if (table[j].choice === answer[k].answerchoiceid) {
        table[j].count++;
      }
    }
  }
  return table;
}

async function updateQuestion(questionid, { question, description, choices, type }) {
  let qUpdate = {question, description, type};
  let answers = [];
  for (var i = 0; i < choices.length; i++) {
    answers.push([choices[i], questionid]);
  }
  await dbPool.query(`UPDATE questions SET ? WHERE id = ?`, [qUpdate, questionid]);
  await dbPool.query(`DELETE FROM votes WHERE questionid = ?`, [questionid]);
  await dbPool.query(`DELETE FROM answerchoices WHERE questionid = ?`, [questionid]);
  await dbPool.query(`INSERT INTO answerchoices (description, questionid) VALUES ? `, [answers]);
  return questionid;
  //`INSERT INTO answerchoices (questionid, description) VALUES ?`,
}

async function deleteQuestion(questionid) {
  let v = await dbPool.query(`DELETE FROM votes WHERE questionid = ?`, [questionid]);
  let q = await dbPool.query(`DELETE FROM questions WHERE id = ?`, [
    questionid
  ]);
  let a =  await dbPool.query(`DELETE FROM answerchoices WHERE questionid = ?`, [
    questionid
  ]);

  return (a.affectedRows + q.affectedRows + v.affectedRows);
}

module.exports = {
  rebuildDatabase,
  getUserById,
  addUser,
  getUserByName,
  setAdminState,
  listUsers,
  updateUser,
  insertNewQuestion,
  listQuestions,
  getQuestion,
  voteForQuestion,
  getUserVotesForQuestion,
  getVotesForQuestion,
  updateQuestion,
  deleteQuestion,
  deleteUserById
  /* add the other functions expected by db.test.js */
};
