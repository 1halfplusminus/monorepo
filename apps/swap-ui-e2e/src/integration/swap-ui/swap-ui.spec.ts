describe('swap-ui: SwapUi component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapui--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to swap-ui!');
    });
});
