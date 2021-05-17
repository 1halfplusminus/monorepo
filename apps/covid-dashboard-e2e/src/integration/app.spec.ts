import { getGreeting } from '../support/app.po';

describe('covid-dashboard', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Covid Pacifique');
  });
});
