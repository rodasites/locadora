const connection = require('./../db/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Promise = require('promise');

const DADOS_CRIPTOGRAFAR = {
  algoritmo: 'aes256',
  segredo: 'chaves',
  tipo: 'hex',
};

const criptografar = (senha) => {
  const cipher = crypto.createCipher(DADOS_CRIPTOGRAFAR.algoritmo, DADOS_CRIPTOGRAFAR.segredo);
  cipher.update(senha);
  return cipher.final(DADOS_CRIPTOGRAFAR.tipo);
};

// jwt
const jwtDuration = '600s'; // Expira em 10 minutos
const jwtSecretKey = 'jwtSecretKey';

const salvarUsuario = (usuario) => {
  return new Promise((resolve, reject) => {
    let existeEmail;

    connection.query('SELECT COUNT(*) as quantidade FROM usuarios WHERE email = ?', usuario.email, (err, result) => {
      if (err) reject(err);

      existeEmail = result[0].quantidade;
      if (existeEmail !== 0) {
        resolve({ Mensagem: 'ERRO Email já cadastrado' });
        return;
      }
      const post = {
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
      };

      post.senha = criptografar(post.senha);
      connection.query('INSERT INTO usuarios SET ?', post, (err2, result2) => {
        if (err2) reject(err2);
        resolve({ Mensagem: 'Usuário criado com sucesso' });
      });
    });
  });
};

const autentica = (body) => {
  return new Promise((resolve, reject) => {
    // Criptografa a senha para comprar
    const senhaCriptografada = criptografar(body.senha);
    // Verifica se o email e senha são compativeis
    connection.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [body.email, senhaCriptografada], (err, result) => {
      if (err) reject(err);

      // Gerador de Token
      jwt.sign({user: result[0].email,}, jwtSecretKey, { expiresIn: jwtDuration }, (err1, token) => {
        const login = {};

        if (typeof result[0].nome !== 'undefined') {
          login.nome = result[0].nome;
        }
        if (typeof result[0].email !== 'undefined') {
          login.email = result[0].email;
        }
        resolve({
          token,
          user: login,
        });
      });
    });
  });
};


const desloga = user => user;

module.exports = {
  salvarUsuario,
  autentica,
  desloga,
};
