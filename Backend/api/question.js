const express = require('express');
const userdb = require('../db/queries.js');
const { requireLogin, requireAdmin, makeJSONToken } = require('./auth');
const nconf = require('nconf');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userapirouter = express.Router();

userapirouter
  .route('/')

  .get(requireLogin, async (req, res) => {
    let pageSize = 10;
    let pageNum = Number(req.query.page);
    let questionCount = 0;
    let hasMore = true;
    let questions = await userdb.listQuestions(pageNum, pageSize);
    let questionList = [];
    for (const question of questions) {
      questionCount++;
      questionList.push({
        id: question.id,
        question: question.question,
        description: question.description,
        type: question.type,
        choices: question.choices
      });
    }
    if (questionCount < pageSize) {
      hasMore = false;
      questionCount = 0;
    }
    res.json({ questions: questionList, has_more: hasMore });
    res.status(200).send();
  })

  .post(requireAdmin, async (req, res) => {
    try {
      //if no username/password entered throw error
      if (req.body.question === undefined) throw 400;
      if (req.body.choices === undefined) throw 400;
      if (req.body.type === undefined) throw 400;

      var question = {
        question: req.body.question,
        description: req.body.description,
        type: req.body.type,
        choices: req.body.choices,
        firstname: req.body.firstname,
        admin: 0
      };
      const id = await userdb.insertNewQuestion(question);
      if (id === undefined) throw 400;

      res.json({ message: 'Question Created', id: id});
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Credentials already in use' });
      } else {
        res.status(err).json({ message: 'Invalid credentials' });
      }
    }
  });

userapirouter
  .route('/:id')

  .put(requireAdmin, async (req, res) => {
    let id = Number(req.params.id);
    let update = {
      question: req.body.question,
      description: req.body.description,
      choices: req.body.choices,
      type: req.body.type
    };

    await userdb.updateQuestion(id, update);

    res.json({ message: 'Question updated' });
  })

  .delete(requireAdmin, async (req, res) => {
    try {
      let id = Number(req.params.id);
      let resp = await userdb.deleteQuestion(id);
      if (resp === 0) throw 404;
      res.status(200).json();
    } catch (err) {
      res.status(err).json(err.code);
    }
  })

  .get(requireLogin, async (req, res) => {
    try {
      let id = Number(req.params.id);
      let question = await userdb.getQuestion(id);
      let response = {
        question: question.question,
        description: question.description,
        type: question.type,
        id: id
      };

      let resp = {
        ...response,
        choices: question.choices
      };
      //response.choices = question.choices;
      res.json(resp);
    } catch (err) {
      res.status(404).json(err);
    }
  });

userapirouter
  .route('/:id/vote')

  .get(requireLogin, async (req, res) => {
    let questionid = Number(req.params.id);
    let isAdmin = Number(req.user.admin);
    if (req.query.user !== undefined) {
      let user1 = Number(req.user.id);
      let user2 = Number(req.query.user);
      try {
        if (user1 !== user2 && !isAdmin) throw 403;
        let userid = Number(req.query.user);
        let result = await userdb.getUserVotesForQuestion(userid, questionid);
        res.json({ votes: result });
        res.status(200).send();
      } catch (err) {
        res.status(err).json();
      }
    } else {
      try {
        let votes = await userdb.getVotesForQuestion(questionid);
        res.json({ totals: votes });
        res.status(200).send();
      } catch (err) {
        res.status(err).json();
      }
    }
  })

  .post(requireLogin, async (req, res) => {
    try {
      let userid = Number(req.user.id);
      let questionid = Number(req.params.id);
      let answerchoiceid = Number(req.body.choice);
      //if no username/password entered throw error
      if (req.params.id === undefined) throw 400;
      if (req.body.choice === undefined) throw 400;
      if (req.user.id === undefined) throw 400;
      await userdb.voteForQuestion(userid, questionid, answerchoiceid, true);

      res.status(200).json();
    } catch (err) {
      res.status(err).json({ message: 'Something went wrong' });
    }
  });
module.exports = userapirouter;
