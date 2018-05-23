const connection = require('./../db/db');

const filmesDisponiveis = () => new Promise((resolve, reject) => {
  // Retorna os filmes com o número de cópias disponível é maior que 0
  connection.query('SELECT * FROM filmes WHERE num_copias > 0', (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  });
});

const locacao = (idUsuario, filmes) => new Promise((resolve, reject) => {
  // Verifica se o filme está disponível para locação
  for (let index = 0; index < filmes.length; index++) {
    connection.query('Select num_copias FROM filmes WHERE id = ?', filmes[index], (err, result) => {
      if (err) reject(err);
      if (result[0].num_copias < 1) {
        resolve({ Mensagem: 'Um dos filmes não está disponível para registo' });
        return;
      }
    });
  }
  const data = new Date();
  const post = {
    usuarios_id: idUsuario,
    data_entrega: data,
    entregue: false,
  };
  // Salva a locação
  connection.query('INSERT INTO locacao SET ?', post, (err1, result1) => {
    if (err1) reject(err1);
    const post2 = [];
    for (let index = 0; index < filmes.length; index++) {
      post2.push({
        filmes_id: filmes[index],
        locacao_id: result1.insertId,
      });
    }
    // Insere os filmes relacionados a locação
    connection.query('INSERT INTO locacao_has_filmes SET ?', post2, (err2, result2) => {
      if (err2) reject(err2);

      // Atualiza o número de cópais disponives do filme
      for (let index2 = 0; index2 < filmes.length; index2++) {
        connection.query(' UPDATE filmes SET num_copias = num_copias - 1 WHERE id = ?', filmes[index2], (err3, result3) => {
          if (err3) reject(err3);
          resolve({ Mensagem: 'Locação salva com sucesso' });
        });
      }
    });
  });
});

const devolucao = idLocacao => new Promise((resolve, reject) => {
  const data = new Date();
/*   const post = {
    data_entrega: data,
    id: idLocacao,
  }; */
  connection.query('UPDATE locacao SET entregue = 1, data_entrega = ? WHERE id = ?', [data, idLocacao], (err, result) => {
    if (err) {
      reject(err);
      return;
    }
  });

  connection.query('SELECT filmes_id FROM locacao_has_filmes WHERE locacao_id = ?', idLocacao, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    for (let index = 0; index < result.length; index++) {
      connection.query(' UPDATE filmes SET num_copias = num_copias + 1 WHERE id = ?', result[index].filmes_id, (err1) => {
        if (err1) {
          reject(err1);
          return;
        }
        resolve({ Mensagem: 'Devolução concluida com sucesso' });
      });
    }
  });
});


const buscaFilmeNome = nome => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM filmes WHERE nome LIKE ?', `%${nome}%`, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  });
});

module.exports = {
  filmesDisponiveis,
  locacao,
  devolucao,
  buscaFilmeNome,
};
