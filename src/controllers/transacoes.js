const { depositos, saques, transferencias } = require('../data/bancodedados');
const { encontrarConta } = require('../utils/funcoes');
const { format } = require('date-fns');

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaDeposito = encontrarConta(numero_conta);

    contaDeposito.saldo += Number(valor);

    const dataFormatada = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    depositos.push({
        "data": dataFormatada,
        numero_conta,
        "valor": Number(valor)
    });

    return res.status(201).json();
}

const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const contaSaque = encontrarConta(numero_conta);

    contaSaque.saldo -= Number(valor);

    const dataFormatada = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    saques.push({
        "data": dataFormatada,
        numero_conta,
        "valor": Number(valor)
    });

    return res.status(201).json();
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const contaOrigem = encontrarConta(numero_conta_origem);
    const contaDestino = encontrarConta(numero_conta_destino);

    contaOrigem.saldo -= Number(valor);
    contaDestino.saldo += Number(valor);

    const dataFormatada = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    transferencias.push({
        "data": dataFormatada,
        numero_conta_origem,
        numero_conta_destino,
        "valor": Number(valor)
    });

    return res.status(201).json();
}

module.exports = {
    depositar,
    sacar,
    transferir
}