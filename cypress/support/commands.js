// cypress/support/commands.js

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-test=email]').type(email);
  cy.get('[data-test=senha]').type(password);
  cy.get('.btn-primary').click();

  cy.get('.alert')
    .should('be.visible')
    .and('include.text', 'Bem vindo'); 
  
  cy.url().should('include', '/logar');
});

Cypress.Commands.add('resetDados', () => {
  cy.get('[data-test=menu-settings]').click();
  cy.get('[href="/reset"]').click();
  cy.get('.alert')
    .should('be.visible')
    .and('include.text', 'Dados resetados com sucesso!');
  cy.url().should('include', '/home');
});

Cypress.Commands.add('navigateToContas', () => {
  cy.get('[data-test=menu-settings]').click(); 
  cy.get('[href="/contas"]').click();
  cy.url().should('include', '/contas');
});

Cypress.Commands.add('addAccount', (accountName) => {
  cy.url().then((url) => {
    if (!url.includes('/contas')) {
      cy.navigateToContas();
    }
  });
  
  cy.get('[data-test=nome]').type(accountName);
  cy.get('.btn-primary').click();
  cy.get('.alert')
    .should('be.visible')
    .and('include.text', 'Conta adicionada com sucesso!');
});

Cypress.Commands.add('navigateToMovimentacao', () => {
  cy.get('[data-test=menu-movimentacao]').click();
  cy.url().should('include', '/movimentacao');
});

Cypress.Commands.add('addMovimentacao', (mov) => {
  cy.url().then((url) => {
    if (!url.includes('/movimentacao')) {
      cy.navigateToMovimentacao();
    }
  });

  cy.get('[data-test=descricao]').clear().type(mov.desc);
  cy.get('[data-test=valor]').clear().type(mov.valor);
  cy.get('[data-test=interessado]').clear().type(mov.interessado);
  cy.get('[data-test=data_transacao]').clear().type(mov.data_transacao);
  cy.get('[data-test=data_pagamento]').clear().type(mov.data_pagamento);

  if (mov.tipo === 'REC') {
    cy.get('#tipoReceita').click();
  } else {
    cy.get('#tipoDespesa').click();
  }

  cy.get('[data-test=conta]').select(mov.conta);

  if (mov.status === 'Paga') {
    cy.get('[data-test=status]').click(); 
  }

  cy.get('.btn-primary').click();
  cy.get('.alert').should('be.visible').and('include.text', 'Movimentação adicionada com sucesso!');
});

Cypress.Commands.add('generateDate', (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
});

Cypress.Commands.add('editAccountByName', (accountName) => {
  cy.url().then((url) => {
    if (!url.includes('/contas')) {
      cy.navigateToContas();
    }
  });
  
  cy.contains('table tbody tr', accountName)
    .find('.fa-edit')
    .click();
});

Cypress.Commands.add('deleteAccountByName', (accountName) => {
  cy.url().then((url) => {
    if (!url.includes('/contas')) {
      cy.navigateToContas();
    }
  });
  
  cy.contains('table tbody tr', accountName)
    .find('.fa-trash-o')
    .click();
});

Cypress.Commands.add('deleteMovimentacaoByDesc', (movimentacaoDescription) => {
  cy.url().then((url) => {
    if (!url.includes('/extrato')) { 
      cy.get('[data-test=menu-extrato]').click();
      cy.url().should('include', '/extrato');
    }
  });
  
  cy.contains('table tbody tr', movimentacaoDescription)
    .find('.fa-trash-o')
    .click();
});