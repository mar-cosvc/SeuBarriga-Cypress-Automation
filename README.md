🚀 Projeto de Automação de Testes E2E - Plataforma Seu Barriga
Este repositório apresenta um projeto de automação de testes End-to-End (E2E) robusto e completo, desenvolvido para a plataforma de gestão financeira "Seu Barriga". Utilizando Cypress como framework principal, o objetivo é garantir a qualidade e a confiabilidade das funcionalidades críticas da aplicação através de um conjunto abrangente de cenários de teste automatizados.

🎯 1. Visão Geral e Objetivo
O foco central deste projeto é a validação automatizada dos fluxos de usuário essenciais na aplicação "Seu Barriga", abrangendo os seguintes módulos chave:

Autenticação e Cadastro de Usuários: Validação dos processos de login e registro, incluindo cenários de sucesso e falha.
Gestão de Contas: Testes para criação, edição e exclusão de contas financeiras.
Registro de Movimentações: Automação do fluxo de adição e manipulação de transações (receitas e despesas).
Resumo Mensal e Extrato: Verificação da correta exibição e filtragem de movimentações no extrato financeiro.
Logout: Confirmação do encerramento seguro da sessão.
A URL base da aplicação testada é: https://seubarriga.wcaquino.me/login

🛠️ 2. Tecnologias e Ferramentas
Este projeto foi construído com as seguintes tecnologias e bibliotecas, demonstrando proficiência em ferramentas modernas de automação e desenvolvimento JavaScript:

Cypress.io: Framework de testes E2E para automação web.
JavaScript (ES6+): Linguagem de programação principal.
Node.js: Ambiente de execução JavaScript.
npm: Gerenciador de pacotes para dependências do projeto.
Mochawesome Reporter: Gerador de relatórios HTML interativos e profissionais para os resultados dos testes.
Git: Sistema de controle de versão distribuído.

📋 3. Pré-requisitos e Configuração do Ambiente
Para configurar e executar os testes em seu ambiente local, siga as instruções abaixo.

3.1. Instalação de Dependências
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

Node.js e npm:
Verificação: Abra seu terminal e execute:
Bash

node -v
npm -v
Se versões forem exibidas, você já os tem instalados.
Instalação: Caso contrário, faça o download e instale a versão LTS (Long Term Support) do Node.js através do site oficial: nodejs.org. O npm será instalado automaticamente junto com o Node.js.

3.2. Configuração do Projeto
Clone o Repositório:
Abra seu terminal ou prompt de comando (no VS Code, por exemplo) e clone o projeto:

Bash

git clone https://github.com/mar-cosvc/SeuBarriga-Cypress-Automation.git
Navegue até o Diretório do Projeto:

Bash

cd SeuBarriga-Cypress-Automation
Instale as Dependências do Projeto:

Bash

npm install
Este comando instalará todas as dependências do Cypress e outras bibliotecas definidas no package.json.

▶️ 4. Como Executar os Testes
Há duas maneiras principais de executar os testes automatizados:

4.1. Modo Interativo (Cypress Test Runner)
Para depurar, desenvolver novos testes ou observar o fluxo em tempo real:

Bash

npx cypress open
Este comando abrirá a interface gráfica do Cypress, onde você poderá selecionar as especificações (.cy.js) para execução ou rodar todos os testes de uma pasta.

4.2. Modo Headless (Via Linha de Comando)
Para execuções em ambiente de CI/CD ou para rodar todos os testes de forma automatizada sem interface gráfica:

Bash

npx cypress run
Os resultados da execução serão exibidos no terminal e os relatórios gerados conforme a configuração.

📊 5. Relatórios de Teste e Evidências
Após a execução dos testes em modo headless (npx cypress run), os relatórios detalhados e as evidências em vídeo serão gerados automaticamente.

Relatórios HTML: Os relatórios Mochawesome (HTML e JSON) são armazenados na pasta cypress/results. Abra o arquivo .html gerado no seu navegador para visualizar um resumo completo das execuções de teste, incluindo cenários passados, falhos, duração e detalhes dos passos.
Evidências em Vídeo: O Cypress registra automaticamente um vídeo de cada execução de teste, que pode ser encontrado na pasta cypress/videos. Estes vídeos servem como evidência visual detalhada do comportamento da aplicação durante os testes.

📁 6. Estrutura do Projeto
A organização do projeto segue as melhores práticas para automação com Cypress:

cypress/e2e/: Contém todos os arquivos de especificação (.cy.js) que definem os cenários de teste End-to-End, organizados por funcionalidade.
cypress/support/: Inclui comandos customizados (commands.js) para promover a reusabilidade e clareza do código, além de arquivos de suporte para pré-condições e configurações globais.
cypress.config.js: Arquivo de configuração principal do Cypress, onde são definidas variáveis de ambiente, configurações de browser, reporters, etc.
.gitignore: Define os arquivos e diretórios que devem ser ignorados pelo Git (ex: node_modules, cypress/videos, cypress/screenshots, cypress/results).
package.json: Armazena metadados do projeto, dependências e scripts npm para execução de testes.

Desenvolvido com ❤️ por Marcos Vinícius Carneiro