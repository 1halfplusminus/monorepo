import { pipe } from 'fp-ts/function';
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace

Cypress.Commands.add('getSpawInformationTooltip', () => {
  return pipe('[class*="tooltip__Tooltip"]', (selector) =>
    cy.get(selector).as('swap-information-tooltip')
  );
});
Cypress.Commands.add('getConfirmSwapModal', () => {
  return cy.get('[class*="ant-modal popup__DarkModal"]').as('swap-information');
});
Cypress.Commands.add('closeConfirmSwapModal', ($modal) => {
  return cy.get('.ant-modal-footer button', { withinSubject: $modal }).click();
});
Cypress.Commands.add(
  'getSwapInformation',
  (within?: JQuery<HTMLElement> | HTMLElement) => {
    return (within
      ? cy.get('[class*="swap-information__Surface"]', {
          withinSubject: within,
        })
      : cy.get('[class*="swap-information__Surface"]')
    ).as('swap-information');
  }
);
Cypress.Commands.add('getFormTitle', () => {
  return cy.get('[class*="swap-form__Title"').as('form-title');
});
Cypress.Commands.add('getTokenAFlatPrice', () => {
  return cy
    .get('[class*="fiat-price-display"]')
    .first()
    .as('tokenA-flat-price');
});
Cypress.Commands.add('getTokenBFlatPrice', () => {
  return cy.get('[class*="fiat-price-display"]').last().as('tokenB-flat-price');
});
Cypress.Commands.add('getTokenASelect', () => {
  return cy
    .get(
      '[class*="token-select__StyledTokenSelectWrapper"]:first [class*="token-select__Text"]'
    )
    .as('tokenA-select');
});
Cypress.Commands.add('getTokenBSelect', () => {
  return cy
    .get(
      '[class*="token-select__StyledTokenSelectWrapper"]:last [class*="token-select__Text"]'
    )
    .as('tokenB-select');
});
Cypress.Commands.add('getTokenSelect', () => {
  return cy.get('[class*="token-select__Text"]').first().as('token-select');
});
Cypress.Commands.add('openTokenSelection', () => {
  return cy
    .get('[class*="token-select__CaretDown"]')
    .as('token-select-carret')
    .click();
});
Cypress.Commands.add('getTokenASold', () => {
  return cy.get('[class*="swap-input__SoldDisplay"]').first().as('tokenA-sold');
});
Cypress.Commands.add('getTokenBSold', () => {
  return cy.get('[class*="swap-input__SoldDisplay"]').last().as('tokenB-sold');
});
Cypress.Commands.add('getTokenAInput', () => {
  return cy.get('[class*="swap-input__Row"] input').first().as('tokenA-input');
});
Cypress.Commands.add('getTokenBInput', () => {
  return cy.get('[class*="swap-input__Row"] input').last().as('tokenB-input');
});
Cypress.Commands.add('openTokenASelection', () => {
  return cy
    .get('[class*="token-select__CaretDown"]')
    .as('tokenA-select-carret')
    .first()
    .click();
});
Cypress.Commands.add('selectTokenA', (token: string) => {
  return cy
    .get('[class*="token-select__CaretDown"]')
    .first()
    .as('tokenA-select-carret')
    .click()
    .get('.ant-list-item-meta-title')
    .contains(token)
    .parents('.ant-list-item')
    .first()
    .click()
    .get('.anticon-close')
    .click();
});
Cypress.Commands.add('selectTokenB', (token: string) => {
  return cy
    .get('[class*="token-select__CaretDown"]')
    .last()
    .as('tokenB-select-carret')
    .click()
    .get('.ant-modal-root:last .ant-list-item-meta-title')
    .contains(token)
    .parents('.ant-list-item')
    .first()
    .click()
    .get('.ant-modal-root:last .anticon-close')
    .click();
});
Cypress.Commands.add('typeTokenA', (value: string, backspace = 3) => {
  return cy
    .getTokenAInput()
    .type(
      Array.from(Array(backspace).keys())
        .map(() => '{backspace} ')
        .join('')
    )
    .type(value);
});
Cypress.Commands.add('typeTokenB', (value: string) => {
  return cy
    .getTokenBInput()
    .type('{backspace} {backspace} {backspace}')
    .type(value);
});
Cypress.Commands.add('getSubmitButton', () => {
  return cy
    .get('[class*="form-submit-button"],[class*="ant-btn connect-button"]')
    .as('submit-btn');
});

Cypress.Commands.add('getPairRateDisplay', () => {
  return cy.get("[class*='pair-price-display']").as('sold-display');
});
