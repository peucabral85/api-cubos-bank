const express = require('express');
const { listarContas, criarContas, atualizarUsuario, excluirConta, consultarSaldo, emitirExtrato } = require('../controllers/contas');
const { validaSenhaBanco, validaSenhaConta, validaCampos, validaConta, validaEmailCpf, validaValorSaldoExclusao } = require('../middlewares/validacoesContas');

const rotasContas = express();

rotasContas.get('/contas', validaSenhaBanco, listarContas);
rotasContas.get('/contas/saldo', validaConta, validaCampos, validaSenhaConta, consultarSaldo);
rotasContas.get('/contas/extrato', validaConta, validaCampos, validaSenhaConta, emitirExtrato);
rotasContas.post('/contas', validaCampos, validaEmailCpf, criarContas);
rotasContas.put('/contas/:numeroConta/usuario', validaConta, validaCampos, validaEmailCpf, atualizarUsuario);
rotasContas.delete('/contas/:numeroConta', validaConta, validaValorSaldoExclusao, excluirConta);

module.exports = rotasContas;