/* eslint-disable no-console */
const test = require("../fixtures/creditCard.json");
describe('CheckoutPage', () => {
    test.forEach(function(data)
    {
   
    it('allows to place an order with optional fields for credit card', () => {
        cy.visit('/');
        cy.get('[data-test="country-selector-dropdown"]').invoke('show');
        cy.contains('United States').click({force:true});
     
      data.products.forEach(function(productlist){
        cy.addLineItem(productlist.product,productlist.quantity);
      })
      cy.visit('/cart');
      cy.get('[data-test=checkout-button]').eq(1).click();
  
      cy.get('[data-test=address-form-firstName]').type(data.firstName);
      cy.get('[data-test=address-form-lastName]').type(data.lastName);
      cy.get('[data-test=address-form-streetName]').type(data.streetName);
      cy.get('[data-test=address-form-additionalStreetInfo]').type(data.additionalStreetInfo);
      cy.get('[data-test=address-form-postalCode]').type(data.postalCode);
      cy.get('[data-test=address-form-region]').type(data.region);
      cy.get('[data-test=address-form-city]').type(data.city);
      cy.get('[data-test=address-form-phone]').type(data.phone);
      cy.get('[data-test=address-form-email]').type(data.email);
      cy.get('[data-test=shipping-methods]')
        .find('.pay-top.sin-payment')
        .should('have.length', 2)
        .eq(0)
        .then(($method) => {
          cy.wrap($method)
            .find('[data-test=checkout-form-shipping-method-name]')
            .contains('Express US');
  
       
          cy.wrap($method)
            .find('[data-test=checkout-form-shipping-method-price]')
            .contains('$10.00');
  
          cy.wrap($method)
            .find('input[type=radio]')
            .check();
        });
  
      cy.get('[data-test=payment-methods]')
        .find('.pay-top.sin-payment')
        .should('have.length', 1);
  
      cy.get('[data-test=other-shipping-address]')
        .click();
      cy.get('[data-test=alt-shipping-address]')
        .should('be.visible');
  
      cy.get('[data-test=address-form-firstName]').eq(1).type(data.firstName);
      cy.get('[data-test=address-form-lastName]').eq(1).type(data.lastName);
      cy.get('[data-test=address-form-streetName]').eq(1).type(data.streetName);
      cy.get('[data-test=address-form-additionalStreetInfo]').eq(1).type(data.additionalStreetInfo);
      cy.get('[data-test=address-form-postalCode]').eq(1).type(data.postalCode);
      cy.get('[data-test=address-form-region]').eq(1).type(data.region);
      cy.get('[data-test=address-form-city]').eq(1).type(data.city);
      cy.get('[data-test=address-form-phone]').eq(1).type(data.phone);
      cy.get('[data-test=address-form-email]').eq(1).type(data.email);
      cy.get('[data-test=payment-methods]');
      cy.get('[data-test=flexform]')
      .click();
      cy.wait(20000);
      cy.getWithinIframe('[name="number"]').type(data.cardnumber);
    
      cy.get('iframe').eq(1).iframeLoaded().its('document').getInDocument('[name="securityCode"]')
      .type(data.securitycode);

      cy.get('#expMonth').select(data.expmonth);
      cy.get('#expYear').select(data.expyear);
     
  
      cy.get('[data-test=placeorder]').click();

      cy.wait(20000);
      //@todo: changing to another address will break saying "Please fill in all required data"
      // cy.get('.order-complete.text-center').should('exist');
    });
    
    
  });
  it('allows to place order without optinal fields for credit card',()=>{
    cy.visit('/');

    cy.get('[data-test="country-selector-dropdown"]').invoke('show');
    cy.contains('United States').click({force:true});

    test[0].products.forEach(function(productlist){
      cy.addLineItem(productlist.product,productlist.quantity);
    })
    cy.visit('/cart');
    cy.get('[data-test=checkout-button]').eq(1).click();

    cy.get('[data-test=address-form-firstName]').type(test[0].firstName);
    cy.get('[data-test=address-form-lastName]').type(test[0].lastName);
    cy.get('[data-test=address-form-streetName]').type(test[0].streetName);
    cy.get('[data-test=address-form-additionalStreetInfo]').type(test[0].additionalStreetInfo);
    cy.get('[data-test=address-form-postalCode]').type(test[0].postalCode);
    cy.get('[data-test=address-form-region]').type(test[0].region);
    cy.get('[data-test=address-form-city]').type(test[0].city);
    cy.get('[data-test=address-form-email]').type(test[0].email);
    cy.get('[data-test=shipping-methods]')
      .find('.pay-top.sin-payment')
      .should('have.length', 2)
      .eq(0)
      .then(($method) => {
        cy.wrap($method)
          .find('[data-test=checkout-form-shipping-method-name]')
          .contains('Express US');

        cy.wrap($method)
          .find('[data-test=checkout-form-shipping-method-price]')
          .contains('$10.00');

        cy.wrap($method)
          .find('input[type=radio]')
          .check();
      });

    cy.get('[data-test=payment-methods]')
      .find('.pay-top.sin-payment')
      .should('have.length', 1);

    cy.get('[data-test=other-shipping-address]')
      .click();
    cy.get('[data-test=alt-shipping-address]')
      .should('be.visible');

    cy.get('[data-test=address-form-firstName]').eq(1).type(test[0].firstName);
    cy.get('[data-test=address-form-lastName]').eq(1).type(test[0].lastName);
    cy.get('[data-test=address-form-streetName]').eq(1).type(test[0].streetName);
    cy.get('[data-test=address-form-additionalStreetInfo]').eq(1).type(test[0].additionalStreetInfo);
    cy.get('[data-test=address-form-postalCode]').eq(1).type(test[0].postalCode);
    cy.get('[data-test=address-form-region]').eq(1).type(test[0].region);
    cy.get('[data-test=address-form-city]').eq(1).type(test[0].city);
    cy.get('[data-test=address-form-email]').eq(1).type(test[0].email);
    cy.get('[data-test=payment-methods]');
    cy.get('[data-test=flexform]')
    .click();
    cy.wait(20000);
    cy.getWithinIframe('[name="number"]').type(test[0].cardnumber);
  
    cy.get('iframe').eq(1).iframeLoaded().its('document').getInDocument('[name="securityCode"]')
    .type(test[0].securitycode);

    cy.get('#expMonth').select(test[0].expmonth);
    cy.get('#expYear').select(test[0].expyear);
   

    cy.get('[data-test=placeorder]').click();
    //@todo: changing to another address will break saying "Please fill in all required data"
    // cy.get('.order-complete.text-center').should('exist');
  });

});