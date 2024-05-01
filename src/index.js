const express = require('express');
const rotasContas = require('./routes/rotasContas');
const rotasTransacoes = require('./routes/rotasTransacoes');

const app = express();

app.use(express.json());
app.use(rotasContas);
app.use(rotasTransacoes);

app.listen(3000, () => {
    console.log(`O servidor está rodando na porta 3000`);
});