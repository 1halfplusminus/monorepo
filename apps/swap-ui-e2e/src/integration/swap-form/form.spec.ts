describe('swap-ui: SwapInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--enter-amount'));

  it('should render the component', () => {
    cy.getTokenASold();
  });
});
