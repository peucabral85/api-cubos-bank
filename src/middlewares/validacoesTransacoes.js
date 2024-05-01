const { encontrarConta } = require('../utils/funcoes');

const validaDeposito = (req, res, next) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json({ "mensagem": "É obrigatório informar o número da conta e o valor de depósito!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "Valor informado inválido. Depósito não efetuado!" });
    }

    next();
}

const validaSaque = (req, res, next) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({ "mensagem": "É obrigatório informar o número da conta, o valor de saque e senha!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "O valor de saque não pode ser menor que zero. Saque não efetuado!" });
    }

    const contaExiste = encontrarConta(numero_conta);

    if (contaExiste.saldo < valor) {
        return res.status(400).json({ "mensagem": "A conta não possui saldo suficiente. Saque não efetuado!" });
    }

    next();
}

const validaTransferencia = (req, res, next) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ "mensagem": "É obrigatório informar todos os dados!" });
    }

    if (valor <= 0) {
        return res.status(400).json({ "mensagem": "Valor de transferência inválido. Transferência não efetuada!" });
    }

    const contaOrigemExiste = encontrarConta(numero_conta_origem);

    if (contaOrigemExiste.saldo < valor) {
        return res.status(400).json({ "mensagem": "A conta não possui saldo suficiente. Transferência não efetuada!" });
    }

    next();
}

module.exports = {
    validaDeposito,
    validaSaque,
    validaTransferencia
}
