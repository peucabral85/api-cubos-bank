const { banco, contas } = require('../data/bancodedados');
const { encontrarConta } = require('../utils/funcoes');

const validaSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query;

    if (!senha_banco) {
        return res.status(401).json({ "mensagem": "A senha do banco não foi informada!" });
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ "mensagem": "A senha do banco informada é inválida!" });
    }

    next();
}

const validaSenhaConta = (req, res, next) => {
    const { senha, numero_conta, numero_conta_origem } = req.body;
    const query = req.query;
    let numeroDaContaValidado = undefined;
    let senhaValidada = undefined;

    query.senha ? senhaValidada = query.senha : senhaValidada = senha;

    if (!senhaValidada) {
        return res.status(400).json({ "mensagem": "É necessário informar sua senha!" });
    }

    if (query.numero_conta) numeroDaContaValidado = query.numero_conta;
    else if (numero_conta) numeroDaContaValidado = numero_conta;
    else if (numero_conta_origem) numeroDaContaValidado = numero_conta_origem;

    const conta = encontrarConta(numeroDaContaValidado);

    if (senhaValidada !== conta.usuario.senha) {
        return res.status(401).json({ "mensagem": "Senha inválida!" });
    }

    next();
}

const validaCampos = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha: senhaBody } = req.body;
    const { numero_conta, senha } = req.query;

    if (Object.keys(req.body).length === 0) { //valida campos das rotas saldo e extrato
        if (!senha || !numero_conta) {
            return res.status(401).json({ "mensagem": "O número e senha da conta são obrigatórios!" });
        }
    } else if (!nome || !cpf || !data_nascimento || !telefone || !email || !senhaBody) {
        return res.status(400).json({ "mensagem": "É obrigatório informar todos os dados." });
    }

    next();
}

const validaConta = (req, res, next) => {
    const { numeroConta } = req.params;
    const { numero_conta, numero_conta_destino, numero_conta_origem } = req.body;
    const query = req.query;

    let numeroDaContaValidado = undefined;

    if (numeroConta) {
        numeroDaContaValidado = numeroConta;
    } else if (numero_conta) {
        numeroDaContaValidado = numero_conta;
    } else if (query.numero_conta) {
        numeroDaContaValidado = query.numero_conta;
    } else if (numero_conta_origem) {
        const contaOrigemExiste = encontrarConta(numero_conta_origem);
        const contaDestinoExiste = encontrarConta(numero_conta_destino);

        if (!contaOrigemExiste) {
            return res.status(404).json({ "mensagem": "A conta de origem informada não existe! Requisição não efetuada." });
        }
        if (!contaDestinoExiste) {
            return res.status(404).json({ "mensagem": "A conta de destino informada não existe! Requisição não efetuada." });
        }

        return next();
    }

    const contaExiste = encontrarConta(numeroDaContaValidado);

    if (!contaExiste) {
        return res.status(404).json({ "mensagem": "A conta não existe ou não foi informada! Requisição não efetuada." })
    }

    next();
}

const validaEmailCpf = (req, res, next) => {
    const { numeroConta } = req.params;
    const { cpf, email } = req.body;

    const emailExiste = contas.find(conta => conta.usuario.email == email);
    const cpfExiste = contas.find(conta => conta.usuario.cpf == cpf);

    if (numeroConta) { //verifica cpf e email do método atualizarUsuario
        const conta = encontrarConta(numeroConta);
        if (conta.usuario.email != email) {
            if (emailExiste) {
                return res.status(400).json({ mensagem: 'Já existe uma conta com o e-mail informado!' });
            }
        }
        if (conta.usuario.cpf != cpf) {
            if (cpfExiste) {
                return res.status(400).json({ mensagem: 'Já existe uma conta com o cpf informado!' });
            }
        }
    } else if (emailExiste) { //verifica email demais métodos
        return res.status(400).json({ "mensagem": "Já existe uma conta com o e-mail informado!" });
    } else if (cpfExiste) { //verifica cpf demais métodos
        return res.status(400).json({ "mensagem": "Já existe uma conta com o cpf informado!" });
    }

    next();
}

const validaValorSaldoExclusao = (req, res, next) => {
    const { numeroConta } = req.params;

    const conta = encontrarConta(numeroConta);
    if (conta.saldo > 0) {
        return res.status(403).json({ mensagem: 'A conta ainda possui saldo. Cancelamento não efetuado.' });
    }

    next();
};

module.exports = {
    validaSenhaBanco,
    validaSenhaConta,
    validaCampos,
    validaConta,
    validaEmailCpf,
    validaValorSaldoExclusao
}