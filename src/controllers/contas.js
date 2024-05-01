const { contas, saques, depositos, transferencias } = require('../data/bancodedados');
const { encontrarConta, encontrarIndexConta } = require('../utils/funcoes');

let idProximaContaCriada = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contas);
}

const criarContas = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const novaConta = {
        "numero": String(idProximaContaCriada),
        "saldo": 0,
        "usuario": {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    contas.push(novaConta);
    idProximaContaCriada++;

    res.status(201).json();
}

const atualizarUsuario = (req, res) => {
    const numeroConta = req.params.numeroConta;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const conta = encontrarConta(numeroConta);

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento;
    conta.usuario.telefone = telefone;
    conta.usuario.email = email;
    conta.usuario.senha = senha;

    res.status(204).json();
}

const excluirConta = (req, res) => {
    const numeroConta = req.params.numeroConta;

    const conta = encontrarIndexConta(numeroConta);

    contas.splice(conta, 1);

    return res.status(204).json();
}

const consultarSaldo = (req, res) => {
    const { numero_conta } = req.query;

    const conta = encontrarConta(numero_conta);

    res.status(201).json({ "saldo": conta.saldo });
}

const emitirExtrato = (req, res) => {
    const { numero_conta } = req.query;

    const extrato = {
        depositos: depositos.filter((deposito) => deposito.numero_conta === numero_conta),
        saques: saques.filter((saque) => saque.numero_conta === numero_conta),
        transferenciasEnviadas: transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta),
        transferenciasRecebidas: transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta)
    }

    return res.status(200).json(extrato);
}

module.exports = {
    listarContas,
    criarContas,
    atualizarUsuario,
    excluirConta,
    consultarSaldo,
    emitirExtrato
}