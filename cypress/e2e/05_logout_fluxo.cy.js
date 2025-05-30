// cypress/e2e/05_logout_fluxo.cy.js

describe('Fluxo de Logout', () => {

  const EMAIL_LOGIN = 'teste@teste.com';
  const SENHA_LOGIN = '123456';

  beforeEach(() => {
    cy.login(EMAIL_LOGIN, SENHA_LOGIN);
  });

  // TC-DESL-001: Deve deslogar do sistema com sucesso
  it('TC-DESL-001: Deve deslogar do sistema com sucesso', () => {
    cy.get('[data-test=menu-logout]').click();
    cy.url().should('include', '/login');
    cy.get('.alert').should('not.exist');
    cy.get('[data-test=email]').should('be.visible');
  });

});