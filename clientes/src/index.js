const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
const ingressos = {};
contador = 0;
app.get('/ingressos', (req, res) => {
  res.send(ingressos);
});
app.put('/ingressos', async (req, res) => {
  contador++;
  const { texto } = req.body;
  ingressos[contador] = {
    contador,
    texto,
  };
  await axios
    .post('http://127.0.0.1:10000/eventos', {
      tipo: 'LembreteCriado',
      dados: {
        contador,
        texto,
      },
    })
    .catch((err) => {
      console.log('err', err);
    });
  res.status(201).send(ingressos[contador]);
});
app.listen(4000, () => {
  console.log('ingressos. Porta 4000');
});
