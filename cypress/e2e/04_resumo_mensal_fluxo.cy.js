// cypress/e2e/04_resumo_mensal_fluxo.cy.js

describe('Fluxo de Resumo Mensal', () => {

  const EMAIL_LOGIN = 'teste@teste.com';
  const SENHA_LOGIN = '123456';
  const UNIQUE_SUFFIX = Date.now();
  const CONTA_PRINCIPAL = `Conta Principal ${UNIQUE_SUFFIX}`;
  const CONTA_SECUNDARIA = `Conta Secundária ${UNIQUE_SUFFIX}`;
  // A variável USUARIO_VALIDO_NOME_REAL não é utilizada neste arquivo.

  let dataMesAtual;
  let dataMesAnterior;

  before(() => {
    // Define as datas base para os meses de teste
    // Usar uma data de referência fixa garante reprodutibilidade entre as execuções.
    const hoje = new Date('2025-05-30'); 

    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    dataMesAtual = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`;

    const mesAnteriorDate = new Date(hoje);
    mesAnteriorDate.setMonth(hoje.getMonth() - 1);
    const mesAnterior = mesAnteriorDate.getMonth() + 1;
    const anoMesAnterior = mesAnteriorDate.getFullYear();
    dataMesAnterior = `${anoMesAnterior}-${String(mesAnterior).padStart(2, '0')}`;
  });

  // Dados das movimentações que serão criadas para o teste
  const MOVIMENTACOES_PARA_TESTE_TEMPLATE = [
    { desc: `Receita Salário ${UNIQUE_SUFFIX}`, valor: '5000', interessado: 'Empresa X', tipo: 'REC', status: 'Paga' },
    { desc: `Despesa Aluguel ${UNIQUE_SUFFIX}`, valor: '1500', interessado: 'Imobiliaria', tipo: 'DESP', status: 'Paga' },
    { desc: `Receita Extra ${UNIQUE_SUFFIX}`, valor: '200', interessado: 'Freelance', tipo: 'REC', status: 'Pendente' },
    { desc: `Despesa Compras ${UNIQUE_SUFFIX}`, valor: '300', interessado: 'Supermercado', tipo: 'DESP', status: 'Paga' }
  ];

  beforeEach(() => {
    cy.login(EMAIL_LOGIN, SENHA_LOGIN);
    cy.resetDados();
    cy.navigateToContas();
    cy.addAccount(CONTA_PRINCIPAL);
    cy.addAccount(CONTA_SECUNDARIA);

    // Cria as movimentações que serão utilizadas nos testes com datas e contas ajustadas
    const movimentacoesComDatas = MOVIMENTACOES_PARA_TESTE_TEMPLATE.map((mov, index) => {
      const novaMov = { ...mov }; 

      // As 2 primeiras são para o mês anterior
      if (index < 2) {
        novaMov.data_transacao = `${dataMesAnterior}-01`;
        novaMov.data_pagamento = `${dataMesAnterior}-05`;
        novaMov.conta = CONTA_PRINCIPAL;
      } 
      // As 2 últimas são para o mês atual
      else {
        novaMov.data_transacao = `${dataMesAtual}-01`;
        novaMov.data_pagamento = `${dataMesAtual}-05`;
        novaMov.conta = CONTA_SECUNDARIA;
      }
      return novaMov;
    });

    cy.wrap(movimentacoesComDatas).each((mov) => {
      cy.navigateToMovimentacao();
      cy.addMovimentacao(mov);
    });

    cy.get('[data-test=menu-extrato]').click();
    cy.url().should('include', '/extrato');
  });

  // TC-RSM-001: Utilizar os filtros para exibir movimentações criadas
  it('TC-RSM-001: Deve filtrar movimentações por mês e conta', () => {
    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const mesAnteriorNome = nomesMeses[parseInt(dataMesAnterior.split('-')[1]) - 1];
    const mesAtualNome = nomesMeses[parseInt(dataMesAtual.split('-')[1]) - 1];

    // Filtra pelo mês anterior
    cy.get('[data-test=mes]').select(mesAnteriorNome);
    cy.get('[data-test=ano]').select(dataMesAnterior.split('-')[0]);
    cy.get('.btn-primary').click();

    cy.contains(`Receita Salário ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Despesa Aluguel ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Receita Extra ${UNIQUE_SUFFIX}`).should('not.exist');
    cy.contains(`Despesa Compras ${UNIQUE_SUFFIX}`).should('not.exist');

    // Filtra pelo mês atual
    cy.get('[data-test=mes]').select(mesAtualNome);
    cy.get('[data-test=ano]').select(dataMesAtual.split('-')[0]);
    cy.get('.btn-primary').click();

    cy.contains(`Receita Extra ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Despesa Compras ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Receita Salário ${UNIQUE_SUFFIX}`).should('not.exist');
    cy.contains(`Despesa Aluguel ${UNIQUE_SUFFIX}`).should('not.exist');

    // Filtra por conta (Conta Principal) no mês anterior
    cy.get('[data-test=mes]').select(mesAnteriorNome); // Garante que o mês correto está selecionado
    cy.get('[data-test=conta]').select(CONTA_PRINCIPAL);
    cy.get('.btn-primary').click();

    cy.contains(`Receita Salário ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Despesa Aluguel ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Receita Extra ${UNIQUE_SUFFIX}`).should('not.exist');
    cy.contains(`Despesa Compras ${UNIQUE_SUFFIX}`).should('not.exist');

    // Filtra por conta (Conta Secundária) no mês atual
    cy.get('[data-test=conta]').select('Conta'); // Limpa o filtro de conta
    cy.get('[data-test=mes]').select(mesAtualNome); // Garante que o mês correto está selecionado
    cy.get('[data-test=conta]').select(CONTA_SECUNDARIA);
    cy.get('.btn-primary').click();

    cy.contains(`Receita Extra ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Despesa Compras ${UNIQUE_SUFFIX}`).should('be.visible');
    cy.contains(`Receita Salário ${UNIQUE_SUFFIX}`).should('not.exist');
    cy.contains(`Despesa Aluguel ${UNIQUE_SUFFIX}`).should('not.exist');
  });

  // TC-RSM-002: Excluir uma movimentação
  it('TC-RSM-002: Deve excluir uma movimentação com sucesso', () => {
    const movimentacaoParaExcluir = `Despesa Aluguel ${UNIQUE_SUFFIX}`;

    // Garante que a movimentação esteja visível (mês anterior) antes de tentar excluir.
    const mesAnteriorNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][parseInt(dataMesAnterior.split('-')[1]) - 1];
    
    cy.get('[data-test=mes]').select(mesAnteriorNome);
    cy.get('[data-test=ano]').select(dataMesAnterior.split('-')[0]);
    cy.get('.btn-primary').click();

    cy.deleteMovimentacaoByDesc(movimentacaoParaExcluir);

    cy.get('.alert')
      .should('be.visible')
      .and('include.text', 'Movimentação removida com sucesso!');

    cy.contains(movimentacaoParaExcluir).should('not.exist');
  });

  // TC-DESL-001: Deslogar do sistema
  it('TC-DESL-001: Deve deslogar do sistema com sucesso', () => {
    cy.get('[data-test=menu-logout]').click();
    cy.url().should('include', '/login');
    cy.get('.alert').should('not.exist');
    cy.get('[data-test=email]').should('be.visible');
  });

});