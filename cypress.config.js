// cypress.config.js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    // Adicione esta linha para habilitar o botão "Run All Specs" na UI do Cypress
    experimentalRunAllSpecs: true, 
    
    // Configurações de URL e Timeouts
    baseUrl: 'https://seubarriga.wcaquino.me', // Confirmado, sem a barra final para melhor compatibilidade
    pageLoadTimeout: 120000, // Mantido em 2 minutos
    defaultCommandTimeout: 15000, // Aumentado para 15 segundos
    
    // CONFIGURAÇÕES DE VÍDEO (Evidências)
    video: true, 
    videosFolder: 'cypress/videos', 
    videoCompression: true, 
    
    reporter: 'mochawesome', 
    reporterOptions: {
      reportDir: 'cypress/results', 
      overwrite: false, 
      html: true, 
      json: true, 
      timestamp: 'dd-mm-yyyy_HH-MM-ss',
    },
  },
})