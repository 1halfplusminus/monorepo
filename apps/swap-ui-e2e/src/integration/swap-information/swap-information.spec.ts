describe('SwapInformation: Primary', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinformation--primary'));
  it('it should display correctly', () => {
    cy.getSwapInformation()
      .should('contain.text', 'Liquidity Provider Fee 0.000007977 ETH')
      .should('contain.text', 'Route ETH > DAI')
      .should('contain.text', 'Price Impact 0%')
      .should('contain.text', 'Minimum received 55246.1 DAI')
      .should('contain.text', 'Slippage tolerance 0.5%');
  });
});
