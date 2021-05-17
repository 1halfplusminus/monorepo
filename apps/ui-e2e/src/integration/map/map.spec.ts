describe('ui: Map component', () => {
  beforeEach(() =>
    cy.visit('/iframe.html?id=covid-map--primary&viewMode=story')
  );

  it('should render the component', () => {
    cy.get('.leaflet-tile')
      .should('have.attr', 'src')
      .and('contain', 'openstreetmap');
  });
});
