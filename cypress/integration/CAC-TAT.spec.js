/// <reference types="Cypress" />

// O bloco DESCRIBE define a suíte de testes, e o bloco IT, define um caso de teste.

describe('Central de Atendimento ao Cliente TAT', function() {
  const THREE_SECOND_IN_MS = 3000

    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {      
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    // Exercício 1
    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Luiz')
        cy.get('#lastName').type('Carlos')
        cy.get('#email').type('teste@email.com')
        cy.get('#open-text-area').type('Teste de área de texto', { delay: 0 })

        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECOND_IN_MS)
        cy.get('.success').should('not.be.visible')
    })

    // Exercício 2
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()
        cy.get('#firstName').type('Luiz')
        cy.get('#email').type('teste@email.com')
        cy.get('#open-text-area').type('Teste de área de texto', { delay: 0 })
        
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECOND_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    // Exercício 3
    it('campo telefone continua vazio quando preenchido com valor não-numérico', function() {
        cy.get('#phone')
          .type('abcdefghij')
          .should('have.value', '')
    })

    // Exercício 4
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type('Luiz')
        cy.get('#lastName').type('Carlos')
        cy.get('#email').type('teste@email.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste de área de texto')
        
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECOND_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    // Exercício 5
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
          .type('Luiz')
          .should('have.value', 'Luiz')
          .clear()
          .should('have.value', '')

        cy.get('#lastName')
          .type('Carlos')
          .should('have.value', 'Carlos')
          .clear()
          .should('have.value', '')

        cy.get('#email')
          .type('teste@email.com')
          .should('have.value', 'teste@email.com')
          .clear()
          .should('have.value', '')

        cy.get('#phone')
          .type('61984848484')
          .should('have.value', '61984848484')
          .clear()
          .should('have.value', '')

        cy.get('#open-text-area')
          .type('Teste de área de texto')
          .should('have.value', 'Teste de área de texto')
          .clear()
          .should('have.value', '')
    })

    // Exercício 6
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
      cy.clock()
      cy.contains('button', 'Enviar').click()

      cy.get('.error').should('be.visible')

      cy.tick(THREE_SECOND_IN_MS)
      cy.get('.error').should('not.be.visible')
    })

    // Exercício 7 - Custom Commands
    it('envia o formulário com sucesso usando um comando customizado', function() {
      cy.clock()
      cy.fillMandatoryFieldsAndSubmit()

      cy.get('.success').should('be.visible')

      cy.tick(THREE_SECOND_IN_MS)
      cy.get('.success').should('not.be.visible')
    })

    // Exercício 8 - Campos de Seleção Suspensa
    it('seleciona um produto (YouTube) por seu texto', function() {
      cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    // Exercício extra - Value
    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
      cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    // Exercício extra - Índice
    it('seleciona um produto (Blog) por seu índice', function() {
      cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    // Exercício 9 - Radio Input
    it('marca o tipo de atendimento "Feedback"', function() {
      cy.get('[type="radio"]')
        .check('feedback')
        .should('be.checked')
        .and('have.value', 'feedback')
    })

    // Exercício extra - Radio Button
    it.only('marca cada tipo de atendimento', function() {
      cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio) {
          cy.wrap($radio).check()
          cy.wrap($radio).should('be.checked')
        })
    })

    // Exercício 10 - Checkbox
    it('marca ambos checkboxes, depois desmarca o último', function() {
      cy.get('#email-checkbox')
        .check('email')
        .should('be.checked')
        .and('have.value', 'email')

      cy.get('#phone-checkbox')
        .check('phone')
        .should('be.checked')
        .and('have.value', 'phone')
      
      cy.get('[type="checkbox"]')
        .last()
        .uncheck()
        .should('not.be.checked')
        .and('have.value', 'phone')
    })
    
    // Exercício 11 - Upload de arquivo
    it('seleciona um arquivo da pasta fixtures', function() {
      cy.get('#file-upload')
        .selectFile('cypress/fixtures/example.json')
        .then(input => {
          expect(input[0].files[0].name).to.eq('example.json')
        // O .then está capturando o input do comando anterior e validando se o nome do primeiro arquivo
        // do primeiro input está igual ao nome informado no .equal
        })
    })

    // Exercício extra - Upload de arquivo
    it('seleciona um arquivo simulando um drag-and-drop', function() {
      cy.get('#file-upload')
        .selectFile('cypress/fixtures/example.json', { action: "drag-drop"})
        .then(input => {
          expect(input[0].files[0].name).to.eq('example.json')
        })
    })

    // Exercício extra 2 - Upload de Arquivo
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
      cy.fixture('example.json', { encoding: null }).as('exampleFile')
      
      cy.get('#file-upload')
        .selectFile('@exampleFile')
        .then(input => {
          expect(input[0].files[0].name).to.eq('example.json')
        })
    })

    // Exercício 12 - Links que abrem em outra aba
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
      cy.get('a')
        .should('have.attr', 'target', '_blank')
    })

    // Exercício extra 1 - Links que abrem em outra aba
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
      cy.get('a')
        .invoke('removeAttr', 'target')
        .click()

      cy.contains('Talking About Testing').should('be.visible')
    })
})