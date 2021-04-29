const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

const clientesPorLembreteId = {};
const { v4: uuidv4 } = require('uuid');

const funcoes = {
  ClienteClassificada: (cliente) => {
    const clientes = clientesPorLembreteId[cliente.lembreteId];
    const obsParaAtualizar = clientes.find((o) => o.id === cliente.id);
    obsParaAtualizar.status = cliente.status;
    axios
      .post('http://127.0.0.1:10000/eventos', {
        tipo: 'ClienteAtualizada',
        dados: {
          id: cliente.id,
          texto: cliente.texto,
          lembreteId: cliente.lembreteId,
          status: cliente.status,
        },
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

//:id é um placeholder
//exemplo: /ingressos/123456/clientes
app.put('/ingressos/:id/clientes', async (req, res) => {
  const idObs = uuidv4();
  const { texto } = req.body;
  //req.params dá acesso à lista de parâmetros da URL
  const clientesDoLembrete = clientesPorLembreteId[req.params.id] || [];
  clientesDoLembrete.push({
    id: idObs,
    texto,
    status: 'aguardando',
  });
  clientesPorLembreteId[req.params.id] = clientesDoLembrete;
  await axios
    .post('http://127.0.0.1:10000/eventos', {
      tipo: 'ClienteCriada',
      dados: {
        id: idObs,
        texto,
        lembreteId: req.params.id,
        status: 'aguardando',
      },
    })
    .catch((err) => {
      console.log('err', err);
    });
  res.status(201).send(clientesDoLembrete);
});
app.get('/ingressos/:id/clientes', (req, res) => {
  res.send(clientesPorLembreteId[req.params.id] || []);
});
app.listen(5000, () => {
  console.log('ingressos. Porta 5000');
});
