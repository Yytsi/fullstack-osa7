describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Testi Mies',
      username: 'testimies',
      password: 'strongpass42'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('username').find('input').type('testimies')
      cy.contains('password').find('input').type('strongpass42')
      cy.contains('login').click()
    })

    it('fails with wrong credentials', function() {
      cy.contains('username').find('input').type('testimies')
      cy.contains('password').find('input').type('wrongpass')
      cy.contains('login').click()
      cy.contains('wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testimies', password: 'strongpass42' })
      cy.visit('')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#titleInput').type('Test blog')
      cy.get('#authorInput').type('Test Author')
      cy.get('#urlInput').type('http://my.example.com')
      cy.contains('button', 'create').click()

      cy.contains('Test blog')
      cy.contains('Test Author')
      cy.contains('view').click()
      cy.contains('http://my.example.com')
      cy.contains('likes 0')
      cy.contains('Test Author')
      cy.contains('hide')
    })

    it('A blog can be liked', function() {
      cy.createBlog({ title: 'Test blog', author: 'Test Author', url: 'http://my.example.com' })
      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted by owner', function() {
      cy.createBlog({ title: 'Test blog', author: 'Test Author', url: 'http://my.example.com' })
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('Test blog').should('not.exist')
      cy.contains('Test Author').should('not.exist')
    })

    it('A blog cannot be deleted by non-owner', function() {
      cy.createBlog({ title: 'Test blog', author: 'Test Author', url: 'http://my.example.com' })
      cy.contains('logout').click()
      const user = {
        name: 'Testi Mies 2',
        username: 'testimies2',
        password: 'strongpass4242'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
      cy.login({ username: 'testimies2', password: 'strongpass4242' })
      cy.visit('')
      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.createBlog({ title: 'Test blog 1', author: 'Test Author 1', url: 'http://my.example.com/1' })
      cy.createBlog({ title: 'Test blog 2', author: 'Test Author 2', url: 'http://my.example.com/2' })
      cy.createBlog({ title: 'Test blog 3', author: 'Test Author 3', url: 'http://my.example.com/3' })
      cy.contains('Test blog 3').parent().contains('view').click()
      cy.contains('Test blog 3').parent().contains('like').click()
      cy.contains('Test blog 3').parent().contains('like').click()
      cy.contains('Test blog 3').parent().contains('like').click()
      cy.contains('Test blog 3').parent().contains('like').click()
      cy.contains('Test blog 2').parent().contains('view').click()
      cy.contains('Test blog 2').parent().contains('like').click()
      cy.contains('Test blog 2').parent().contains('like').click()
      cy.contains('Test blog 1').parent().contains('view').click()
      cy.contains('Test blog 1').parent().contains('like').click()

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('Test blog 3')
        cy.wrap(blogs[1]).contains('Test blog 2')
        cy.wrap(blogs[2]).contains('Test blog 1')
      })

      cy.contains('Test blog 1').parent().contains('like').click()
      cy.contains('Test blog 1').parent().contains('like').click()
      cy.contains('Test blog 1').parent().contains('like').click()
      cy.contains('Test blog 1').parent().contains('like').click()
      cy.contains('Test blog 1').parent().contains('like').click()

      cy.get('.blog').then(blogs => {
        cy.wrap(blogs[0]).contains('Test blog 1')
        cy.wrap(blogs[1]).contains('Test blog 3')
        cy.wrap(blogs[2]).contains('Test blog 2')
      })
    })
  })
})