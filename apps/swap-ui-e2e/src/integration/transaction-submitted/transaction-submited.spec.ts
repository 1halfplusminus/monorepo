describe('Transaction Submitted: Primary', () => {
  beforeEach(() =>
    cy.visitCaptureError('/iframe.html?id=transactionsubmitted--primary')
  );

  it('Should render correctly', () => {
    cy.get('[class*="transaction-submitted"]')
      .should('contain.text', 'Transaction Submitted')
      .should('contain.text', 'View On Explorer')
      .should('contain.text', 'Add ETH to Metamask');
  });
});
