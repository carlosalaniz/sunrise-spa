/* eslint-disable no-console */
import jwt_decode from "jwt-decode";
import payments from "./payments.api";
import flexApi from "./flex.api";
import flexStyle from "./FlexMicroformStyle";

const FlexSourceURL = 'https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js';
const VisaChktURL =
  'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
const PaymentInterface = process.env.VUE_APP_CYBERSOURCE_INTEGRATION;
const PaymentInterfaceType = process.env.VUE_APP_CYBERSOURCE_INTEGRATION_TYPE;
const VisaCheckoutApiKey = process.env.VUE_APP_VISA_CHECKOUT_API_KEY;
// eslint-disable-next-line no-unused-vars
var CallId = null;

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
        show: false,
        flexMicroFormObject: null,
        captureContext: null,
        jsLoaded: false
      },
      visaCheckout: {
        show: true,
        paymentMethodName: "visaCheckout",
        jsLoaded: false,
        visaCallId: null
      }
    },
  }),
  methods: {
    async onPaymentMethodChange(event) {
      // hide current payment
      const currentPayMethod = this.PaymentMethods.showing;
      this.PaymentMethods[currentPayMethod].show = false;
      //show new one
      const newPaymentMethod = event.target.value;
      await this.renderPaymentMethod(newPaymentMethod);
    },

    async renderPaymentMethod(paymentMethod) {
      switch (paymentMethod) {
        case "flexMicroform":
          this.PaymentMethods.showing = "flexMicroform";
          this.PaymentMethods["flexMicroform"].show = true;
          await this.renderFlex();
          break;
        case "visaCheckout":
          // alert("visaCheckout");
          this.PaymentMethods.showing = "visaCheckout";
          this.PaymentMethods.visaCheckout.show = true;
          await this.renderVisaChkt();
      }
    },

    async appendFlexJS() {
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
    async appendVisaChktJS() {
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
    async renderVisaChkt() {
      await this.appendVisaChktJS();
      // alert("loaded");
      await this.onVisaCheckoutReady();
    },

    async onVisaCheckoutReady() {
      var thisContext = this;
      thisContext.error = null;
      // V is defined through renderVisaChkt()
      // eslint-disable-next-line no-undef
      V.init({
        apikey: VisaCheckoutApiKey,
        paymentRequest: {
          currencyCode: this.amount.currencyCode,
          subtotal: this.amount.centAmount
        },
        /* settings: {
          shipping: {
              collectShipping: "${vcShippingEnabled}",
              acceptedRegions: ["GB", "US", "DE"]
          }
        } */
      });

      // eslint-disable-next-line no-undef
      V.on("payment.success", function (payment) {
        thisContext.PaymentMethods.visaCheckout.visaCallId = payment.callid;
        thisContext.placeOrder();
      });
      // eslint-disable-next-line no-undef
      V.on("payment.cancel", function (payment) {
        console.log(payment);
        thisContext.error = "You have cancelled the payment using Visa Checkout";
        return;
      });
      // eslint-disable-next-line no-undef
      V.on("payment.error", function (payment, error) {
        console.log("VC error:", payment, error);
        thisContext.error = "VC error:"+JSON.stringify(error);
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
            const customFields = await this.prepareFlexMicroformPaymentFields();
            paymentData.paymentMethodInfo.method = 'creditCard';
            paymentData.custom = customFields;
          } catch (e) {
            this.error = JSON.stringify(e);
            return;
          }
          break;
        }
        case "visaCheckout": {
          try {
            const customFields = await this.prepareVisaCheckoutPaymentFields();
            paymentData.paymentMethodInfo.method = 'visaCheckout';
            paymentData.custom = customFields;
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
          beforeCompleteAsync: async () => {
            const serviceResponse = await payments.addTransaction(this.$store.state.payment);
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
            return serviceResponse;
          },
          afterComplete: () => {
            cybersourceContext.loading = false;
          }
        }
      );
    },

    async prepareFlexMicroformPaymentFields() {
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
    async prepareVisaCheckoutPaymentFields() {
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
    await this.renderPaymentMethod("this.PaymentMethods.showing");
    //await this.renderVisaChkt();
  },
  updated: function () {
  },
};


