describe('ui: Country Stats', () => {
  beforeEach(() =>
    cy
      .intercept({
        method: 'GET',
        url: '**historical**',
      })
      .as('historical')
      .visit('/iframe.html?id=covid-countrystats--primary&viewMode=story')
  );

  it('should fetch historicals data  correctly', () => {
    cy.wait('@historical')
      .get('h4[class*="statistique-card__StatistiqueCardTitle"]:first > span')
      .as('title')
      .should('contain', '29 519')
      .invoke('text')
      .then((death) => parseInt(death.replace(/ /g, ''), 10))
      .as('death')
      .get('div[class*="statistique-card__StatistiqueCardVariation"]:first')
      .as('variation')
      .as('variationText')
      .get('svg[class*="chevron-left"]')
      .click()
      .get('@title')
      .should('not.contain', '29 519')
      .invoke('text')
      .then((death) => parseInt(death.replace(/ /g, ''), 10))
      .as('deathYesterday')
      .get('svg[class*="StyledChevronRight"]')
      .click()
      .get('@variation')
      .should('contain', '20');
  });
});
