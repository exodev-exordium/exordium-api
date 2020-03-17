/*
verify sent username and password,
respond with encrypted token that is saved in the db in accordance with that account

(future security = limit responses with a username, and from specific hosts)
*/

const express = require('express');
const router = express.Router();

router.get('/token/:id', (req, res) => {
  const { id } = req.params;
  res.send({ id });
});

module.exports = router;
