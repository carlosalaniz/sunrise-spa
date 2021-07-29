/* eslint-disable no-console */
import jwt_decode from "jwt-decode";
import payments from "./payments.api";
import flexApi from "./flex.api";
import cartApi from "./cart.api";
import flexStyle from "./FlexMicroformStyle";

const FlexSourceURL = 'https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js';
const VisaChktURL =
  'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
const PaymentInterface = process.env.VUE_APP_CYBERSOURCE_INTEGRATION;
const PaymentInterfaceType = process.env.VUE_APP_CYBERSOURCE_INTEGRATION_TYPE;
const VisaCheckoutApiKey = process.env.VUE_APP_VISA_CHECKOUT_API_KEY;

const createPaymentAsync = async function (paymentDto) {
  return await payments.create(paymentDto);
}

export default {
  props: {
    amount: Object
  },
  watch: {
  },
  data: () => ({
    error: null,
    loading: false,
    PaymentMethods: {
      showing: "visaCheckout",
      flexMicroform: {
        flexMicroFormObject: null,
        captureContext: null,
        jsLoaded: false
      },
      visaCheckout: {
        jsLoaded: false,
        visaCallId: null
      }
    },
  }),
  methods: {
    async onPaymentMethodChange(event) {
      const newPaymentMethod = event.target.value;
      await this.renderPaymentMethod(newPaymentMethod);
    },

    async renderPaymentMethod(paymentMethod) {
      switch (paymentMethod) {
        case "flexMicroform":
          await this.renderFlex();
          break;
        case "visaCheckout":
          await this.renderVisaCheckout();
      }
    },

    appendFlexJS() {
      if (!this.PaymentMethods.flexMicroform.jsLoaded) {
        this.PaymentMethods.flexMicroform.jsLoaded = new Promise(function (resolve, reject) {
          const flexScript = document.createElement('script');
          flexScript.setAttribute('src', FlexSourceURL);
          flexScript.onload = function () {
            resolve(true);
          };
          flexScript.onerror = function (event) {
            reject(event);
          };
          document.head.appendChild(flexScript);
        });
      }
      return this.PaymentMethods.flexMicroform.jsLoaded;
    },

    async renderFlex() {
      await this.appendFlexJS();
      const flexContext = await flexApi.getFlexContext();
      const captureContext = flexContext.captureContext;
      const verificationContext = flexContext.verificationContext;
      // Flex comes from flex JS on appendFlexJS()
      // eslint-disable-next-line
      const flexInstance = new Flex(captureContext);
      var flexMicroform = flexInstance.microform({ styles: flexStyle });
      flexMicroform
        .createField('number', { placeholder: 'Enter card number' })
        .load('#number-container-1');
      flexMicroform
        .createField('securityCode', { placeholder: '•••' })
        .load('#securityCode-container');
      this.PaymentMethods.flexMicroform.flexMicroFormObject = flexMicroform;
      this.PaymentMethods.flexMicroform.verificationContext = verificationContext;
    },

    appendVisaCheckoutJS() {
      if (!this.PaymentMethods.visaCheckout.jsLoaded) {
        this.PaymentMethods.visaCheckout.jsLoaded = new Promise(function (resolve, reject) {
          const visaChktScript = document.createElement('script');
          visaChktScript.setAttribute('src', VisaChktURL);
          visaChktScript.onload = function () {
            resolve(true);
          };
          visaChktScript.onerror = function (event) {
            reject(event);
          };
          document.head.appendChild(visaChktScript);
        });
      }
      return this.PaymentMethods.visaCheckout.jsLoaded;
    },

    async renderVisaCheckout() {
      await this.appendVisaCheckoutJS();
      await this.onVisaCheckoutReady();
    },

    async onVisaCheckoutReady() {
      // V is defined through renderVisaChkt()
      // eslint-disable-next-line no-undef
      V.init({
        apikey: VisaCheckoutApiKey,
        paymentRequest: {
          currencyCode: this.amount.currencyCode,
          subtotal: this.amount.centAmount
        },
      });

      // eslint-disable-next-line no-undef
      V.on("payment.success", (payment) => {
        this.PaymentMethods.visaCheckout.visaCallId = payment.callid;
        this.placeOrder();
      });

      // eslint-disable-next-line no-undef
      V.on("payment.error", (payment, error) => {
        console.log("VisaCheckout:", payment, error);
        this.error = JSON.stringify(error);
        return;
      });
    },

    async placeOrder() {
      this.error = null;
      let paymentData = {
        amountPlanned: {
          currencyCode: this.amount.currencyCode,
          centAmount: this.amount.centAmount
        },
        paymentMethodInfo: {
          paymentInterface: PaymentInterface,
          method: null,
        },
        custom: null
      };
      const currentPayMethod = this.PaymentMethods.showing;
      switch (currentPayMethod) {
        case "flexMicroform": {
          try {
            const flexCustomFields = await this.prepareFlexMicroformPaymentFields();
            paymentData.paymentMethodInfo.method = 'creditCard';
            paymentData.custom = flexCustomFields;
          } catch (e) {
            this.error = JSON.stringify(e);
            return;
          }
          break;
        }
        case "visaCheckout": {
          try {
            const VisaCheckoutCustomFields = await this.prepareVisaCheckoutPaymentFields();
            paymentData.paymentMethodInfo.method = 'visaCheckout';
            paymentData.custom = VisaCheckoutCustomFields;
          } catch (e) {
            this.error = JSON.stringify(e);
            return;
          }
          break;
        }
        default:
          throw new Error(currentPayMethod + " Not recognized")
      }
      const oldPayment = this.$store.state.payment;
      oldPayment?.id && payments.delete(oldPayment)
      const payment = await createPaymentAsync(paymentData);
      this.$store.dispatch("setPayment", payment);
      this.loading = true;
      var cybersourceContext = this;
      this.$emit("card-paid", payment.id,
        {
          onValidationError: () => {
            cybersourceContext.loading = false;
          },
          beforeCompleteAsync: async (result) => {
            const lastPaymentState = await payments.get(this.$store.state.payment.id);
            const serviceResponse = await payments.addTransaction(lastPaymentState);
            if (serviceResponse.error) {
              cybersourceContext.loading = false;
              cybersourceContext.error = "Something went wrong, try again.";
              throw new Error(serviceResponse.error);
            }
            const lastTransaction = serviceResponse.transactions.pop();
            if (!lastTransaction || lastTransaction.state === "Failure") {
              cybersourceContext.loading = false;
              cybersourceContext.error = "Something went wrong, try again.";
              if (lastTransaction) {
                cybersourceContext.error += ` ${lastTransaction.id}`
              }
              throw new Error("Something went wrong, try again.");
            }
            const updatedCart = await cartApi.get(result.data.updateMyCart.id);
            if (updatedCart.version != result.data.updateMyCart.version) {
              // eslint-disable-next-line no-param-reassign
              result.data.updateMyCart = updatedCart;
            }
            return result;
          },
          afterComplete: () => {
            cybersourceContext.loading = false;
          }
        }
      );
    },

    prepareFlexMicroformPaymentFields() {
      return new Promise((resolve, reject) => {
        var microform = this.PaymentMethods.flexMicroform.flexMicroFormObject;
        const verificationContext = this.PaymentMethods.flexMicroform.verificationContext;
        var options = {
          expirationMonth: document.querySelector('#expMonth').value,
          expirationYear: document.querySelector('#expYear').value
        };
        microform.createToken(options, (err, jwtToken) => {
          if (err) {
            reject(err.message);
          } else {
            try {
              const flexData = jwt_decode(jwtToken);
              const paymentCustomFields =
              {
                type: {
                  key: PaymentInterfaceType
                },
                fields: {
                  isv_token: jwtToken,
                  isv_tokenVerificationContext: verificationContext,
                  isv_maskedPan: flexData.data.number,
                  isv_cardType: flexData.data.type,
                  isv_cardExpiryMonth: flexData.data.expirationMonth,
                  isv_cardExpiryYear: flexData.data.expirationYear
                }
              }
              resolve(paymentCustomFields);
            } catch (e) {
              reject(e);
            }
          }
        });
      })
    },

    prepareVisaCheckoutPaymentFields() {
      return new Promise((resolve, reject) => {
        var visaChktCallId = this.PaymentMethods.visaCheckout.visaCallId;
        try {
          const paymentCustomFields =
          {
            type: {
              key: PaymentInterfaceType
            },
            fields: {
              isv_token: visaChktCallId
            }
          }
          resolve(paymentCustomFields);
        } catch (e) {
          reject(e);
        }
      })
    },
  },

  async mounted() {
    await this.renderPaymentMethod(this.PaymentMethods.showing);
  },
  updated: function () {
  },
};


