const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { salvarUsuario, autentica, desloga } = require('./../dao/usuarios');

const jwtSecretKey = 'jwtSecretKey';

// verify token
const verify = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).json({
      message: 'Unauthorized', // header without bearer token
    });
  }
};

/* GET users listing. */
router.post('/salvar', verify, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    try {
      return salvarUsuario(req.body).then(result => res.json(result));
    } catch (err1) {
      return res.sendStatus(500).json(err1);
    }
  });
});

router.post('/autenticar', (req, res) => {
  try {
    return autentica(req.body)
      .then(result => res.json(result));
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
});

router.post('/desloga', (req, res) => {
/*   try {
    desloga(req.body);
    res.statusCode(200);
  } catch (err) {
    res.statusCode(500).json({
      message: 'Não foi possível deslogar',
    });
  } */
});

module.exports = router;
