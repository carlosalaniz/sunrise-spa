describe('CheckoutPage', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('allows to place an order', () => {
   
    cy.addLineItem('/product/a6/SKU-6', 2);
    cy.addLineItem('/product/holland-barrett-caplets-500mg/taurinevariantskutwo', 3);
      cy.visit('/cart');
      cy.get('[data-test=checkout-button]').eq(1).click();
  
      cy.get('[data-test=address-form-firstName]').type('Sandra');
      cy.get('[data-test=address-form-lastName]').type('M');
      cy.get('[data-test=address-form-streetName]').type('Street1');
      cy.get('[data-test=address-form-additionalStreetInfo]').type('1295 Charleston road');
      cy.get('[data-test=address-form-postalCode]').type('94043');
      cy.get('[data-test=address-form-region]').type('California');
      cy.get('[data-test=address-form-city]').type('Mountain View');
      cy.get('[data-test=address-form-phone]').type('None');
      cy.get('[data-test=address-form-email]').type('sandra.m@commercetools.com');
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
  
      cy.get('[data-test=address-form-firstName]').eq(1).type('Sandra');
      cy.get('[data-test=address-form-lastName]').eq(1).type('M');
      cy.get('[data-test=address-form-streetName]').eq(1).type('Street1');
      cy.get('[data-test=address-form-additionalStreetInfo]').eq(1).type('1295 Charleston road');
      cy.get('[data-test=address-form-postalCode]').eq(1).type('94043');
      cy.get('[data-test=address-form-region]').eq(1).type('California');
      cy.get('[data-test=address-form-city]').eq(1).type('Mountain View');
      cy.get('[data-test=address-form-phone]').eq(1).type('555-44-22-11');
      cy.get('[data-test=address-form-email]').eq(1).type('sandra.m@commercetools.com');
      cy.get('[data-test=payment-methods]');
      cy.get('[data-test=flexform]')
      .click();
      cy.wait(20000);
      cy.getWithinIframe('[name="number"]').type('4111111111111111');
    
    cy.get('iframe')
    .eq(1)
    .iframeLoaded()
    .its('document')
    .getInDocument('[name="securityCode"]')
    .type('123');


      cy.get('#expMonth').select('05');
      cy.get('#expYear').select('2023');
      
  
      cy.get('[data-test=placeorder]').click();
      //@todo: changing to another address will break saying "Please fill in all required data"
      // cy.get('.order-complete.text-center').should('exist');
    });
  });
  