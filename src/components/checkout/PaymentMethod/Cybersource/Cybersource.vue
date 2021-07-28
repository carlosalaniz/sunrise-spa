<i18n src="./Cybersource.txt"></i18n>
<style src="./Cybersource.scss" lang="scss" scoped></style>
<script src="./Cybersource.js"></script>
<template>
  <span>
    <div class="checkout-shipping-content">
      <div class="shipping-content-left">
        <span class="bold-text">Payment Method</span>
      </div>
    </div>
    <div class="payment-method">
      <div class="pay-top sin-payment">
        <input
          id="payment-method-3"
          v-model="PaymentMethods.showing"
          class="input-radio"
          type="radio"
          value="flexMicroform"
          name="payment_method"
          @change="onPaymentMethodChange($event)"
        />
        <label for="payment-method-3">Cybersource Credit Card</label>
        <div id="loading" v-if="loading"><span> Loading... </span></div>
        <div v-show="PaymentMethods.flexMicroform.show">
          <form id="my-form" onsubmit="return false">
            <div class="form-row" style="margin-top: 10px">
              <div class="col-sm-6">
                <label id="cardNumber-label" style="margin: 0px"
                  >Card Number</label
                >
                <div id="number-container-1" class="form-control"></div>
              </div>
              <div class="col-sm-6">
                <label for="securityCode-container" style="margin: 0px"
                  >Security Code</label
                >
                <div id="securityCode-container" class="form-control"></div>
              </div>
            </div>
            <div class="form-row" style="margin-top: 10px">
              <div class="form-group col-md-6">
                <label for="expMonth" style="margin: 0px">Expiry month</label>
                <select id="expMonth" name="expMonth" class="form-control">
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
              </div>
              <div class="form-group col-md-6">
                <label for="expYear" style="margin: 0px">Expiry year</label>
                <select id="expYear" name="expYear" class="form-control">
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </select>
              </div>
            </div>
          </form>
          <button @click="placeOrder" class="next-place-order">
        {{ $t("placeOrder") }}
      </button>
        </div>
      </div>
    </div>
    <div class="payment-method">
      <div class="pay-top sin-payment">
        <input
          id="payment-method-4"
          v-model="PaymentMethods.visaCheckout.paymentMethodName"
          class="input-radio"
          type="radio"
          value="visaCheckout"
          name="payment_method"
          @change="onPaymentMethodChange($event)"
        />
        <label for="payment-method-3">Visa checkout</label>
        <div v-show="PaymentMethods.visaCheckout.show">
          <img alt="Visa Checkout" class="v-button" role="button"
            src="https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png"/>
        </div>
      </div>
    </div>
    <div v-show="error!=null">
      <div class="error-message" style="color: red">
        {{ error }}
      </div>
    </div>
    
  </span>
</template>
