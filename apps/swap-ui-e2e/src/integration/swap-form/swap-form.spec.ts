describe('swap-ui: SwapForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--enter-amount'));

  it('It should display sold correctly', () => {
    cy.getTokenASold().should('contain.value', '100 ETH');
  });
});
