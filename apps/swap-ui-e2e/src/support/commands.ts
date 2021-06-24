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
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getTokenSelect(): Chainable<JQuery<HTMLInputElement>>;
    openTokenSelection(): Chainable<JQuery<HTMLInputElement>>;
    getTokenASold(): Chainable<JQuery<HTMLInputElement>>;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('getTokenSelect', () => {
  return cy.get('div[class*="token-select__Text"]').as('token-select');
});
Cypress.Commands.add('openTokenSelection', () => {
  return cy
    .get('[class*="token-select__CaretDown"]')
    .as('token-select-carret')
    .click();
});
Cypress.Commands.add('getTokenASold', () => {
  return cy.get('[class*="swap-input__SoldDisplay"]').as('tokena-sold').click();
});
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
