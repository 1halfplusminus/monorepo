describe('swap-ui: SwapInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to swap-ui!');
    });
});
