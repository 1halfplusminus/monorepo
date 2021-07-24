describe('swap-ui: SwapInput Primary', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--primary'));

  it('should render the component', () => {
    cy.get('input')
      .as('input')
      .should('have.value', '0.0')
      .typeTokenA('10.0')
      .should('have.value', '10.0')
      .openTokenSelection()
      .get('#rcDialogTitle1')
      .should('contain', 'Select a token');
  });
});

describe('swap-ui: SwapInput With Sold', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--with-sold'));

  it('should render the component', () => {
    cy.getTokenASold().should('contain.text', 'Solde: 10 ETH');
  });
});

describe('swap-ui: SwapInput Flat price', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--with-fiat-price'));

  it('should render the component', () => {
    cy.getTokenAFlatPrice().should('contain.text', '~$ 10000');
  });
});

describe('swap-ui: With State', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapinput--with-state'));

  it('should render the component', () => {
    cy.getTokenASelect()
      .should('contain.text', 'ETH')
      .getTokenAInput()
      .should('contain.value', '100')
      .getTokenAFlatPrice()
      .should('contain.text', '~$ 100000');
  });
});
