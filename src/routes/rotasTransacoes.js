const express = require('express');
const { depositar, sacar, transferir } = require('../controllers/transacoes');
const { validaDeposito, validaSaque, validaTransferencia } = require('../middlewares/validacoesTransacoes');
const { validaConta, validaSenhaConta } = require('../middlewares/validacoesContas');

const rotasTransacoes = express();

rotasTransacoes.post('/transacoes/depositar', validaConta, validaDeposito, depositar);
rotasTransacoes.post('/transacoes/sacar', validaConta, validaSenhaConta, validaSaque, sacar);
rotasTransacoes.post('/transacoes/transferir', validaConta, validaSenhaConta, validaTransferencia, transferir);



module.exports = rotasTransacoes;