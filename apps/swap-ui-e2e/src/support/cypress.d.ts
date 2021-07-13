declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    getSpawInformationTooltip(): Chainable<JQuery<HTMLInputElement>>;
    closeConfirmSwapModal(
      within: JQuery<HTMLElement> | HTMLElement
    ): Chainable<JQuery<HTMLInputElement>>;
    getConfirmSwapModal(): Chainable<JQuery<HTMLInputElement>>;
    getSwapInformation(
      within?: JQuery<HTMLElement> | HTMLElement
    ): Chainable<JQuery<HTMLInputElement>>;
    getFormTitle(): Chainable<JQuery<HTMLInputElement>>;
    getTokenSelect(): Chainable<JQuery<HTMLInputElement>>;
    getTokenASelect(): Chainable<JQuery<HTMLInputElement>>;
    getTokenBSelect(): Chainable<JQuery<HTMLInputElement>>;
    getTokenAFlatPrice(): Chainable<JQuery<HTMLInputElement>>;
    getTokenBFlatPrice(): Chainable<JQuery<HTMLInputElement>>;
    openTokenSelection(): Chainable<JQuery<HTMLInputElement>>;
    openTokenASelection(): Chainable<JQuery<HTMLInputElement>>;
    getTokenASold(): Chainable<JQuery<HTMLInputElement>>;
    getTokenAInput(): Chainable<JQuery<HTMLInputElement>>;
    getTokenBInput(): Chainable<JQuery<HTMLInputElement>>;
    getTokenBSold(): Chainable<JQuery<HTMLInputElement>>;
    getSubmitButton(): Chainable<JQuery<HTMLInputElement>>;
    getPairRateDisplay(): Chainable<JQuery<HTMLInputElement>>;
    selectTokenA(token: string): Chainable<JQuery<HTMLInputElement>>;
    selectTokenB(token: string): Chainable<JQuery<HTMLInputElement>>;
    typeTokenB(
      value: string,
      backspace?: number
    ): Chainable<JQuery<HTMLInputElement>>;
    typeTokenA(
      value: string,
      backspace?: number
    ): Chainable<JQuery<HTMLInputElement>>;
  }
}
