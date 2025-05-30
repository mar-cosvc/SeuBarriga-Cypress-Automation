// cypress/e2e/03_movimentacao_fluxo.cy.js

describe('Fluxo de Gestão de Movimentações', () => {

  const EMAIL_LOGIN = 'teste@teste.com';
  const SENHA_LOGIN = '123456';
  const UNIQUE_SUFFIX = Date.now();
  const CONTA_RECEITA = `Conta Receita ${UNIQUE_SUFFIX}`;
  const CONTA_DESPESA = `Conta Despesa ${UNIQUE_SUFFIX}`;
  // A variável USUARIO_VALIDO_NOME_REAL não é utilizada neste arquivo, pode ser removida.

  beforeEach(() => {
    cy.login(EMAIL_LOGIN, SENHA_LOGIN);
    cy.resetDados();
    cy.navigateToContas();
    cy.addAccount(CONTA_RECEITA);
    cy.addAccount(CONTA_DESPESA);
    cy.navigateToMovimentacao();
  });

  // TC-MOV-001: Criar múltiplas movimentações (receitas e despesas)
  it('TC-MOV-001: Deve criar múltiplas movimentações (receitas e despesas)', () => {
    const hoje = Cypress.Commands.generateDate();
    const amanha = Cypress.Commands.generateDate(1);
    const ontem = Cypress.Commands.generateDate(-1);

    const movimentacoes = [
      { desc: `Salário ${UNIQUE_SUFFIX} - 01`, valor: '3000', interessado: 'Empresa X', data_transacao: ontem, data_pagamento: hoje, tipo: 'REC', conta: CONTA_RECEITA, status: 'Paga' },
      { desc: `Aluguel Recebido ${UNIQUE_SUFFIX} - 02`, valor: '1500', interessado: 'Inquilino Y', data_transacao: hoje, data_pagamento: amanha, tipo: 'REC', conta: CONTA_RECEITA, status: 'Pendente' },
      { desc: `Conta Luz ${UNIQUE_SUFFIX} - 03`, valor: '250', interessado: 'Cemig', data_transacao: ontem, data_pagamento: hoje, tipo: 'DESP', conta: CONTA_DESPESA, status: 'Paga' },
      { desc: `Aluguel Pago ${UNIQUE_SUFFIX} - 04`, valor: '1200', interessado: 'Locador Z', data_transacao: hoje, data_pagamento: amanha, tipo: 'DESP', conta: CONTA_DESPESA, status: 'Pendente' },
    ];

    movimentacoes.forEach((mov) => {
      cy.addMovimentacao(mov);
      cy.navigateToMovimentacao();
    });

    cy.get('[data-test=menu-extrato]').click();
    cy.url().should('include', '/extrato');
    movimentacoes.forEach(mov => {
      cy.contains(mov.desc).should('be.visible');
    });
  });

  // TC-MOV-002: Não deve permitir criar movimentação com campo de data inválido/vazio
  it('TC-MOV-002: Não deve permitir criar movimentação com data inválida/vazia', () => {
    const hoje = Cypress.Commands.generateDate();

    // Cenário 1: Data de Transação Vazia
    cy.navigateToMovimentacao();
    cy.get('[data-test=descricao]').type(`Teste Data Transacao Vazia ${UNIQUE_SUFFIX}`);
    cy.get('[data-test=valor]').type('100');
    cy.get('[data-test=interessado]').type('Teste Data');
    cy.get('[data-test=data_transacao]').clear();
    cy.get('[data-test=data_pagamento]').type(hoje);
    cy.get('[data-test=conta]').select(CONTA_RECEITA);
    cy.get('#tipoReceita').click();
    cy.get('[data-test=status]').click();
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Data da Transação é obrigatória');

    // Cenário 2: Data de Pagamento Vazia
    cy.navigateToMovimentacao();
    cy.get('[data-test=descricao]').type(`Teste Data Pagamento Vazia ${UNIQUE_SUFFIX}`);
    cy.get('[data-test=valor]').type('100');
    cy.get('[data-test=interessado]').type('Teste Data Pagamento');
    cy.get('[data-test=data_transacao]').type(hoje);
    cy.get('[data-test=data_pagamento]').clear();
    cy.get('[data-test=conta]').select(CONTA_RECEITA);
    cy.get('#tipoReceita').click();
    cy.get('[data-test=status]').click();
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Data do Pagamento é obrigatória');

    // Cenário 3: Data de Transação Inválida
    cy.navigateToMovimentacao();
    cy.get('[data-test=descricao]').type(`Teste Data Transacao Invalida ${UNIQUE_SUFFIX}`);
    cy.get('[data-test=valor]').type('100');
    cy.get('[data-test=interessado]').type('Teste Data Invalida');
    cy.get('[data-test=data_transacao]').type('Data Invalida');
    cy.get('[data-test=data_pagamento]').type(hoje);
    cy.get('[data-test=conta]').select(CONTA_RECEITA);
    cy.get('#tipoReceita').click();
    cy.get('[data-test=status]').click();
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Data da Transação inválida');
  });

  // TC-MOV-003: Não deve permitir criar movimentação com campo de valor inválido/vazio
  it('TC-MOV-003: Não deve permitir criar movimentação com valor inválido/vazio', () => {
    const hoje = Cypress.Commands.generateDate();

    // Cenário 1: Valor Vazio
    cy.navigateToMovimentacao();
    cy.get('[data-test=descricao]').type(`Teste Valor Vazio ${UNIQUE_SUFFIX}`);
    cy.get('[data-test=interessado]').type('Teste Valor');
    cy.get('[data-test=data_transacao]').type(hoje);
    cy.get('[data-test=data_pagamento]').type(hoje);
    cy.get('[data-test=conta]').select(CONTA_RECEITA);
    cy.get('#tipoReceita').click();
    cy.get('[data-test=status]').click();
    cy.get('[data-test=valor]').clear();
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Valor é obrigatório');

    // Cenário 2: Valor Não Numérico
    cy.navigateToMovimentacao();
    cy.get('[data-test=descricao]').type(`Teste Valor NaoNumerico ${UNIQUE_SUFFIX}`);
    cy.get('[data-test=valor]').type('abc');
    cy.get('[data-test=interessado]').type('Teste Valor NaoNumerico');
    cy.get('[data-test=data_transacao]').type(hoje);
    cy.get('[data-test=data_pagamento]').type(hoje);
    cy.get('[data-test=conta]').select(CONTA_RECEITA);
    cy.get('#tipoReceita').click();
    cy.get('[data-test=status]').click();
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Valor deve ser um número');
  });

});