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

      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('input[type="email"]').click( {force:true})
        .type('shwethak@gmail.com')
      
      cy.get('[id=vcop-src]')
      .find('iframe[id="vcop-src-frame"]')
        .iframeLoaded()
        .its('document')
        .getInDocument('[value="Continue"]')
        .click({force:true});
  
        cy.wait(10000);
  
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
          .type('4111111111111111', {force:true})
          });
          
        cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="expiry"]').click( {force:true})
          .type('05/25', {force:true})
        
          cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="addCardCVV"]').click( {force:true})
          .type('123', {force:true})
  
          cy.get('[id=vcop-src]')
          .find('iframe[id="vcop-src-frame"]')
            .iframeLoaded()
            .its('document')
            .getInDocument('input[id="first_name"]').click( {force:true})
            .type('Sandra', {force:true})
  
        cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="last_name"]').click( {force:true})
          .type('M', {force:true})
        
        cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="address_line1"]').click( {force:true})
          .type('1295 Charleston road', {force:true})
  
          cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="address_city"]').click( {force:true})
          .type('Mountain View', {force:true})
  
        cy.get('[id=vcop-src]')
        .find('iframe[id="vcop-src-frame"]')
          .iframeLoaded()
          .its('document')
          .getInDocument('input[id="address_state_province_code"]').click( {force:true})
          .type('CA', {force:true})


          cy.get('[id=vcop-src]')
         .find('iframe[id="vcop-src-frame"]')
         .iframeLoaded()
           .its('document')
           .getInDocument('input[id="address_postal_code"]').click( {force:true})
           .type('94043', {force:true})
           
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
                .type('7025797511', {force:true})
            
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
            
    });
  });