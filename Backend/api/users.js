const express = require('express');
const userdb = require('../db/queries.js');
const { requireLogin, requireAdmin, makeJSONToken } = require('./auth');
const nconf = require('nconf');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userapirouter = express.Router();

userapirouter
  .route('/')

  .get(requireAdmin, async (req, res) => {
    let pageSize = 10;
    let pageNum = Number(req.query.page);
    let userCount = 0;
    let hasMore = true;
    let users = await userdb.listUsers(pageNum, pageSize);
    let usersList = [];
    for (const user of users) {
      userCount++;
      usersList.push({
        id: user.id,
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        admin: user.admin,
        username: user.username
      });
    }
    if (userCount < pageSize) {
      hasMore = false;
      userCount = 0;
    }
    res.json({ users: usersList, has_more: hasMore });
    res.status(200).send();
  })

  .delete(requireAdmin, async (req, res) => {
    let users = await userdb;
    users.clear();
    res.status(200).json();
  })

  .post(async (req, res) => {
    try {
      //if no username/password entered throw error
      if (req.body.username === undefined) throw 400;
      if (req.body.password === undefined) throw 400;
      if (req.body.firstname === undefined) throw 400;
      if (req.body.lastname === undefined) throw 400;
      if (req.body.email === undefined) throw 400;

      let password = await bcrypt.hash(req.body.password, 5);
      req.body.password = password;
      var user = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        admin: 0
      };
      const id = await userdb.addUser(user);
      if (id === undefined) throw 400;
      let returnUser = {
        username: req.body.username,
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        email: req.body.email,
        id: id
      };
      let token = await makeJSONToken(returnUser); //assign token to variable

      res.json({ message: 'User created', token: token, user: returnUser });
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

  .put(requireLogin, async (req, res) => {
    try {
      let id = Number(req.params.id);
      let saved_id = Number(req.user.id);

      if (saved_id !== id && !req.user.admin) {
        throw 403;
      }

      let update = req.body;
      if (req.body.password !== undefined) {
        update.password = await bcrypt.hash(req.body.password, 8);
      }
      await userdb.updateUser(id, update);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Username or Email already in use' });
      } else {
        res.status(403).json({ message: err });
      }
    }
    res.json({ message: 'User updated' });
  })

  .delete(requireLogin, async (req, res) => {
    try {
      let id = Number(req.params.id);
      await userdb.deleteUserById(id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(404).json(err);
    }
  })

  .get(requireLogin, async (req, res) => {
    try {
      let id = Number(req.params.id);
      let user = await userdb.getUserById(id);
      user = user[0];
      res.json({ id: user.id, username: user.username, lastname: user.lastname, firstname: user.firstname, email: user.email });
    } catch (err) {
      res.status(404).json(err);
    }
  });
module.exports = userapirouter;
