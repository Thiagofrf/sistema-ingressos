const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const palavraChave = 'importante';

const funcoes = {
  ClienteCriada: (cliente) => {
    cliente.status = cliente.texto.includes(palavraChave)
      ? 'importante'
      : 'comum';
    axios
      .post('http://127.0.0.1:10000/eventos', {
        tipo: 'ClienteClassificada',
        dados: cliente,
      })
      .catch((err) => {
        console.log('err', err);
      });
  },
};

app.post('/eventos', (req, res) => {
  try {
    funcoes[req.body.tipo](req.body.dados);
  } catch (err) {}
  res.status(200).send({
    msg: 'ok',
  });
});

app.listen(7000, () => console.log('Classificação. Porta 7000'));
