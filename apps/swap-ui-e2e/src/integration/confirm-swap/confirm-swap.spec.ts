describe('ConfirmSwap: Primary', () => {
  beforeEach(() => cy.visit('/iframe.html?id=confirmswap--primary'));

  it('It should display correctly', () => {
    cy.getTokenASelect()
      .should('contain.text', 'From ETH')
      .getTokenBSelect()
      .should('contain.text', 'To DAI')
      .getPairRateDisplay()
      .should('contain.text', '1 DAI = 0.001883 ETH')
      .getSwapInformation();
  });
});
