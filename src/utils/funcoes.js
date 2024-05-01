const { contas } = require('../data/bancodedados');

const encontrarConta = (numeroConta) => {
    return contas.find(conta => conta.numero === numeroConta);
}

const encontrarIndexConta = (numeroConta) => {
    return contas.findIndex(conta => conta.numero === numeroConta);
}

module.exports = {
    encontrarConta,
    encontrarIndexConta
}