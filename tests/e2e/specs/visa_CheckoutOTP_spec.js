describe('CheckoutPage', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('allows to place an order', () => {
      cy.addLineItem('/product/a6/SKU-6', 2);
    cy.addLineItem('/product/holland-barrett-caplets-500mg/taurinevariantskutwo', 3);
      cy.visit('/cart');
      cy.get('[data-test=checkout-button]').eq(1).click();
  
      cy.get('[data-test=address-form-firstName]').type('Charlie');
      cy.get('[data-test=address-form-lastName]').type('Bucket');
      cy.get('[data-test=address-form-streetName]').type('Nowhere str.');
      cy.get('[data-test=address-form-additionalStreetInfo]').type('Crocked house');
      cy.get('[data-test=address-form-postalCode]').type('54321');
      cy.get('[data-test=address-form-region]').type('California');
      cy.get('[data-test=address-form-city]').type('Little Town');
      cy.get('[data-test=address-form-phone]').type('None');
      cy.get('[data-test=address-form-email]').type('charlie.bucket@commercetools.com');
      cy.get('[data-test=shipping-methods]')
        .find('.pay-top.sin-payment')
        .should('have.length', 2)
        .eq(1)
        .then(($method) => {
          cy.wrap($method)
            .find('[data-test=checkout-form-shipping-method-name]')
            .contains('Express EU');
  
        //   cy.wrap($method)
        //     .find('[data-test=checkout-form-shipping-method-description]')
        //     .contains(/^\s*Same day delivery\s*$/);
  
          cy.wrap($method)
            .find('[data-test=checkout-form-shipping-method-price]')
            .contains(/\s10,00\s€\s/);
  
          cy.wrap($method)
            .find('input[type=radio]')
            .check();
        });
  
      cy.get('[data-test=payment-methods]')
        .find('.pay-top.sin-payment')
        .should('have.length', 0);
  
      cy.get('[data-test=other-shipping-address]')
        .click();
      cy.get('[data-test=alt-shipping-address]')
        .should('be.visible');
  
      cy.get('[data-test=address-form-firstName]').eq(1).type('Willy');
      cy.get('[data-test=address-form-lastName]').eq(1).type('Wonka');
      cy.get('[data-test=address-form-streetName]').eq(1).type('Cherry Street');
      cy.get('[data-test=address-form-additionalStreetInfo]').eq(1).type('Chocolate Factory');
      cy.get('[data-test=address-form-postalCode]').eq(1).type('12345');
      cy.get('[data-test=address-form-region]').eq(1).type('California');
      cy.get('[data-test=address-form-city]').eq(1).type('Little Town');
      cy.get('[data-test=address-form-phone]').eq(1).type('555-44-22-11');
      cy.get('[data-test=address-form-email]').eq(1).type('willy.wonka@commercetools.com');
      cy.get('[data-test=payment-methods]');
      cy.get('[data-test=visaCheckout]')
      .click();
      cy.wait(10000);
     
      cy.get('[data-test=visa-button]').click();
      cy.wait(20000);

      //enter an existing mail address
      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('input[type="email"]').click()
        .type('sandra.m07@wipro.com')

      //click on continue
      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('[value="Continue"]')
        .click({force:true});
  
      cy.wait(60000);
    // enter otp manually
  
    //click on continue
      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('input[value="Continue"]')
        .click({force:true})

        cy.wait(10000);
    //click on continue if the card data is loaded 
      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('[value="Continue"]')
        .click({force:true});
  
  
    });
  });