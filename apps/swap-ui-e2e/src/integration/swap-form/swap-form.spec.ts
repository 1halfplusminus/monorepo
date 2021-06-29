describe('swap-ui: SwapForm component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--enter-amount'));

  it('It should display sold correctly', () => {
    cy.getTokenASold().should('contain.text', '100 ETH');
  });
  it('It should display tokenA default value correctly', () => {
    cy.getTokenAInput().should('contain.value', '0.0');
  });
  it('It should set tokenA input correctly', () => {
    cy.getTokenAInput().typeTokenA('99.1').should('have.value', 99.1);
  });
  it('It should display sold tokenB correctly after token selected', () => {
    cy.selectTokenB('USDC')
      .getTokenBSold()
      .should('contain.text', '100 USDC')
      .getSubmitButton()
      .should('contain.text', 'Entrez un montant')
      .should('have.attr', 'disabled');
  });

  it('It should display correct button', () => {
    cy.selectTokenA('USDC')
      .selectTokenB('ETH')
      .getSubmitButton()
      .should('contain.text', 'Entrez un montant')
      .should('have.attr', 'disabled')
      .typeTokenA('101.0')
      .getSubmitButton()
      .should('contain.text', 'Insufficient USDC balance')
      .should('have.attr', 'disabled')
      .typeTokenA('10', 5)
      .getSubmitButton()
      .should('contain.text', 'Swap')
      .should('not.have.attr', 'disabled');
  });
});
