// cypress/e2e/01_login_fluxo.cy.js

describe('Fluxo de Login e Cadastro de Usuário', () => {

  // Constantes para credenciais de login existentes
  const EMAIL_LOGIN_EXISTENTE = 'teste@teste.com';
  const SENHA_LOGIN_EXISTENTE = '123456';

  // Antes de cada teste, reseta o estado da URL para a base
  // e remove qualquer resíduo de sessão, garantindo testes independentes.
  beforeEach(() => {
    // cy.visit('/'); // A baseUrl é configurada em cypress.config.js
    // cy.clearCookies(); // Pode ser útil se houver persistência de sessão indesejada entre testes
    // cy.clearLocalStorage(); // Pode ser útil se houver persistência de dados no localStorage
  });

  // TLGN-001: Deve criar um novo usuário com sucesso
  it('TLGN-001: Deve criar um novo usuário com sucesso', () => {
    const uniqueSuffix = Date.now();
    const newUserEmail = `usuario.cypress.${uniqueSuffix}@teste.com`;
    const newUserName = `Novo Usuário Cypress ${uniqueSuffix}`;
    const newUserPassword = 'senhaSegura123';

    cy.visit('/cadastro');
    cy.url().should('include', '/cadastro');

    cy.get('#nome').type(newUserName);
    cy.get('#email').type(newUserEmail);
    cy.get('#senha').type(newUserPassword);
    cy.get('body > div.jumbotron.col-lg-4 > form > input').click({ force: true }); 

    cy.get('.alert.alert-success', { timeout: 15000 }) // Reduzindo o timeout para 15s, como o defaultCommandTimeout
      .should('be.visible')
      .and('include.text', 'Usuário inserido com sucesso'); 
    
    cy.url().should('include', '/cadastrarUsuario'); 
  });

  // TLGN-002: Não deve permitir login com credenciais não cadastradas
  it('TLGN-002: Não deve permitir login com credenciais não cadastradas', () => {
    cy.visit('/login');
    cy.get('[data-test=email]').type('usuario.naoexiste@teste.com');
    cy.get('[data-test=senha]').type('senhaIncorreta');
    cy.get('.btn-primary').click();

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Problemas com o login do usuário'); 

    cy.url().should('include', '/login');
  });

  // TLGN-003: Deve realizar login com sucesso com usuário existente
  it('TLGN-003: Deve realizar login com sucesso com usuário existente', () => {
    cy.login(EMAIL_LOGIN_EXISTENTE, SENHA_LOGIN_EXISTENTE);
  });

});