describe('swap-ui: SwapForm Primary', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--primary'));

  it('It should display correctly', () => {
    cy.getTokenASelect()
      .should('contain.text', 'Select a token')
      .getTokenBSelect()
      .should('contain.text', 'Select a token')
      .getFormTitle()
      .should('contain.text', 'Permuter');
  });
});
describe('swap-ui: SwapForm Swap', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--swap'));

  it('It should display correctly', () => {
    cy.getSubmitButton()
      .should('contain.text', 'Swap')
      .should('not.have.attr', 'disabled')
      .getPairRateDisplay()
      .should('contain.text', '1 DAI = 0.001899 ETH')
      .click()
      .should('contain.text', '1 ETH = 526 DAI')
      .getTokenASold()
      .should('contain.text', '100 ETH')
      .getTokenBSold()
      .should('contain.text', '100 DAI')
      .getSpawInformationTooltip()
      .trigger('mouseover')
      .trigger('mouseleave')
      .get('.ant-tooltip')
      .within(($tooltip) => cy.getSwapInformation($tooltip))
      .getSubmitButton()
      .click()
      .getConfirmSwapModal()
      .within(($modal) =>
        cy.getSwapInformation($modal).closeConfirmSwapModal($modal)
      );
  });
});

describe('swap-ui: SwapForm Disconnected', () => {
  beforeEach(() => cy.visit('/iframe.html?id=swapform-form--disconnected'));

  it('It should display connected button', () => {
    cy.getSubmitButton()
      .should('contain.text', 'Connecter le portefeuille')
      .should('not.have.attr', 'disabled');
  });
});

describe('swap-ui: SwapForm Enter Amount', () => {
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
