const test = require("../fixtures/visa.json");
describe('CheckoutPage', () => {
test.forEach(function(data){
   
       
        it('allows to place an order with visa Checkout', () => {
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
          // cy.get('[data-test=visaCheckout]')
          // .click();
          // cy.wait(10000);
          
          cy.get('[data-test=visa-button]').click();
          cy.wait(20000);
    
          cy.get('[id=vcop-src]')
          .find('iframe[id="vcop-src-frame"]')
            .iframeLoaded()
            .its('document')
            .getInDocument('input[type="email"]').click( {force:true})
            .type(data.visaemail1);
          
          cy.get('[id=vcop-src]')
          .find('iframe[id="vcop-src-frame"]')
            .iframeLoaded()
            .its('document')
            .getInDocument('[value="Continue"]')
            .click({force:true});
      
            cy.wait(30000);
      
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('p[id="notificationMsg"]').then( ()=>{
                cy.get('[id=vcop-src]')
               .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="cardNumber-CC"]').click( {force:true})
              .type(data.cardnumber, {force:true})
              });
              
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="expiry"]').click( {force:true})
              .type(data.expiry, {force:true})
            
              cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="addCardCVV"]').click( {force:true})
              .type(data.securitycode, {force:true})
      
              cy.get('[id=vcop-src]')
              .find('iframe[id="vcop-src-frame"]')
                .iframeLoaded()
                .its('document')
                .getInDocument('input[id="first_name"]').click( {force:true})
                .type(data.visafirstname, {force:true})
      
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="last_name"]').click( {force:true})
              .type(data.visalastname, {force:true})
            
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="address_line1"]').click( {force:true})
              .type(data.visaaddress1, {force:true})
      
              cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="address_city"]').click( {force:true})
              .type(data.visacity, {force:true})
      
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('input[id="address_state_province_code"]').click( {force:true})
              .type(data.visastate, {force:true})
    
    
              cy.get('[id=vcop-src]')
             .find('iframe[id="vcop-src-frame"]')
             .iframeLoaded()
               .its('document')
               .getInDocument('input[id="address_postal_code"]').click( {force:true})
               .type(data.visapostal, {force:true})
               
                cy.get('[id=vcop-src]')
                .find('iframe[id="vcop-src-frame"]')
                  .iframeLoaded()
                  .its('document')
                  .getInDocument('[id="in"]').trigger('mousemove',{force:true}).click({force:true})
    
                  cy.get('[id=vcop-src]')
                  .find('iframe[id="vcop-src-frame"]')
                    .iframeLoaded()
                    .its('document')
                    .getInDocument('input[id="address_phone"]').click( {force:true})
                    .type(data.visaphone, {force:true})
                
                    cy.get('[id=vcop-src]')
                    .find('iframe[id="vcop-src-frame"]')
                      .iframeLoaded()
                      .its('document')
                      .getInDocument('[value="Continue"]')
                      .click({force:true});
    
                 cy.wait(20000);
                      cy.get('[id=vcop-src]')
                      .find('iframe[id="vcop-src-frame"]')
                        .iframeLoaded()
                        .its('document')
                        .getInDocument('[name="Sign Up"]')
                        .click({force:true});
               
                        cy.wait(40000);
        });
      
});

it('place order without optional fields for visa Chckout', () => {

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
  // cy.get('[data-test=visaCheckout]')
  // .click();
  // cy.wait(10000);
  
  cy.get('[data-test=visa-button]').click();
  cy.wait(20000);

  cy.get('[id=vcop-src]')
  .find('iframe[id="vcop-src-frame"]')
    .iframeLoaded()
    .its('document')
    .getInDocument('input[type="email"]').click( {force:true})
    .type(test[0].visaemail2);
  
  cy.get('[id=vcop-src]')
  .find('iframe[id="vcop-src-frame"]')
    .iframeLoaded()
    .its('document')
    .getInDocument('[value="Continue"]')
    .click({force:true});

    cy.wait(30000);

    cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('p[id="notificationMsg"]').then( ()=>{
        cy.get('[id=vcop-src]')
       .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="cardNumber-CC"]').click( {force:true})
      .type(test[0].cardnumber, {force:true})
      });
      
    cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="expiry"]').click( {force:true})
      .type(test[0].expiry, {force:true})
    
      cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="addCardCVV"]').click( {force:true})
      .type(test[0].securitycode, {force:true})

      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('input[id="first_name"]').click( {force:true})
        .type(test[0].visafirstname, {force:true})

    cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="last_name"]').click( {force:true})
      .type(test[0].visalastname, {force:true})
    
    cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="address_line1"]').click( {force:true})
      .type(test[0].visaaddress1, {force:true})

      cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="address_city"]').click( {force:true})
      .type(test[0].visacity, {force:true})

    cy.get('[id=vcop-src]')
    .find('iframe[id="vcop-src-frame"]')
      .iframeLoaded()
      .its('document')
      .getInDocument('input[id="address_state_province_code"]').click( {force:true})
      .type(test[0].visastate, {force:true})


      cy.get('[id=vcop-src]')
     .find('iframe[id="vcop-src-frame"]')
     .iframeLoaded()
       .its('document')
       .getInDocument('input[id="address_postal_code"]').click( {force:true})
       .type(test[0].visapostal, {force:true})
       
        cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('[id="in"]').trigger('mousemove',{force:true}).click({force:true})

          cy.get('[id=vcop-src]')
          .find('iframe[id="vcop-src-frame"]')
            .iframeLoaded()
            .its('document')
            .getInDocument('input[id="address_phone"]').click( {force:true})
            .type(test[0].visaphone, {force:true})
        
            cy.get('[id=vcop-src]')
            .find('iframe[id="vcop-src-frame"]')
              .iframeLoaded()
              .its('document')
              .getInDocument('[value="Continue"]')
              .click({force:true});

         cy.wait(20000);
              cy.get('[id=vcop-src]')
              .find('iframe[id="vcop-src-frame"]')
                .iframeLoaded()
                .its('document')
                .getInDocument('[name="Sign Up"]')
                .click({force:true});
        
                cy.wait(40000);

  });

});