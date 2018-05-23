const express = require('express');

const jwt = require('jsonwebtoken');

const router = express.Router();
const {
  buscaFilmeNome, devolucao, filmesDisponiveis, locacao,
} = require('./../dao/filmes');

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
router.get('/buscaFilmeNome', verify, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    try {
      return buscaFilmeNome(req.body.nomeFilme).then(result => res.json(result));
    } catch (err1) {
      return res.sendStatus(500).json(err1);
    }
  });
});

router.get('/filmesDisponiveis', verify, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    try {
      return filmesDisponiveis().then(result => res.json(result));
    } catch (err1) {
      return res.sendStatus(500).json(err1);
    }
  });
});

router.post('/locacao', verify, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    try {
      return locacao(req.body.idUsuario, req.body.filmes).then(result => res.json(result));
    } catch (err1) {
      return res.sendStatus(500).json(err1);
    }
  });
});

router.post('/devolucao', verify, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, (err) => {
    if (err) {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
    try {
      return devolucao(req.body.idLocacao).then(result => res.json(result));
    } catch (err1) {
      return res.sendStatus(500).json(err1);
    }
  });
});

module.exports = router;
