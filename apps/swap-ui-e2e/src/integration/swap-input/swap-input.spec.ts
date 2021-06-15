describe('swap-ui: SwapInput component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--primary'));

  it('should render the component', () => {
    cy.get('input')
      .as('input')
      .should('have.value', '0.0')
      .type('{backspace} {backspace} {backspace}')
      .type('10.0')
      .should('have.value', '10.0')
      .openTokenSelection()
      .get('#rcDialogTitle1')
      .should('contain', 'Select a token');
  });
});
