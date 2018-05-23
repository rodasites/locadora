const mysql = require('mysql');

// Função para conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'locacao4all',
  password: '',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

module.exports = connection;
