describe('swap-ui: TokenSelect component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=tokenselect--primary'));

  it('should render the component', () => {
    cy.get('div[class*="token-select__Text"]')
      .as('token-select')
      .should('contain', 'Select a token');
  });
});
