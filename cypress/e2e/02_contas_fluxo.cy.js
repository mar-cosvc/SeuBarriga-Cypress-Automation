// cypress/e2e/02_contas_fluxo.cy.js

describe('Fluxo de Gestão de Contas', () => {

  const EMAIL_LOGIN = 'teste@teste.com';
  const SENHA_LOGIN = '123456';
  // A variável USUARIO_VALIDO_NOME_REAL não é utilizada neste arquivo, pode ser removida.

  beforeEach(() => {
    cy.login(EMAIL_LOGIN, SENHA_LOGIN);
    cy.resetDados();
    cy.navigateToContas();
  });

  // TC-CNT-001: Adicionar no mínimo 2 contas e listá-las
  it('TC-CNT-001: Deve adicionar no mínimo 2 contas e listá-las', () => {
    const uniqueSuffix = Date.now();
    const conta1Nome = `Conta Cypress ${uniqueSuffix}-1`;
    const conta2Nome = `Conta Cypress ${uniqueSuffix}-2`;

    cy.addAccount(conta1Nome);
    cy.addAccount(conta2Nome);

    cy.get('table.table tbody')
      .should('contain', conta1Nome)
      .and('contain', conta2Nome);
  });

  // TC-CNT-002: Alterar o nome de uma conta
  it('TC-CNT-002: Deve alterar o nome de uma conta existente', () => {
    const contaOriginalNome = `Conta para Editar ${Date.now()}`;
    const contaNovoNome = `Conta Editada Cypress ${Date.now()}`;

    cy.addAccount(contaOriginalNome);
    cy.editAccountByName(contaOriginalNome);

    cy.get('[data-test=nome]').clear().type(contaNovoNome);
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Conta alterada com sucesso!');
    cy.get('table.table tbody')
      .should('contain', contaNovoNome)
      .and('not.contain', contaOriginalNome);
  });

  // TC-CNT-003: Não deve permitir excluir conta com movimentação vinculada
  it('TC-CNT-003: Não deve permitir excluir conta com movimentação vinculada', () => {
    const contaComMovNome = `Conta com Mov ${Date.now()}`;

    cy.addAccount(contaComMovNome);
    cy.navigateToMovimentacao();

    // Cria uma movimentação vinculada à conta recém-criada
    cy.get('[data-test=descricao]').type('Movimentação de Teste');
    cy.get('[data-test=valor]').type('100');
    cy.get('[data-test=interessado]').type('Cliente Cypress');
    cy.get('[data-test=data_transacao]').type('2025-05-30'); // Data atual
    cy.get('[data-test=data_pagamento]').type('2025-05-30'); // Data atual
    cy.get('[data-test=conta]').select(contaComMovNome);
    cy.get('[data-test=status]').click(); // Marca como Paga

    cy.get('.btn-primary').click();
    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Movimentação adicionada com sucesso!');

    cy.navigateToContas();
    cy.deleteAccountByName(contaComMovNome);

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Conta em uso na movimentações');
  });

  // TC-CNT-004: Não deve permitir adicionar conta com nome já existente
  it('TC-CNT-004: Não deve permitir adicionar conta com nome já existente', () => {
    const contaDuplicadaNome = `Conta Duplicada ${Date.now()}`;

    cy.addAccount(contaDuplicadaNome);

    cy.get('[data-test=nome]').type(contaDuplicadaNome);
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Já existe uma conta com esse nome!');
  });

});