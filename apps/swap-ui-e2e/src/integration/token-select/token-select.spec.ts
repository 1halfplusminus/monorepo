describe('swap-ui: TokenSelect component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=tokenselect--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to swap-ui!');
    });
});
