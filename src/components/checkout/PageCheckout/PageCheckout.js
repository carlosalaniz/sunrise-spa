import gql from "graphql-tag";
import cartMixin from "../../../mixins/cartMixin";
import CheckoutTopSection from "../CheckoutTopSection/CheckoutTopSection.vue";
import OrderOverview from "../OrderOverview/OrderOverview.vue";
import BillingDetails from "../BillingDetails/BillingDetails.vue";
import CART_FRAGMENT from "../../Cart.gql";
import MONEY_FRAGMENT from "../../Money.gql";
import ADDRESS_FRAGMENT from "../../Address.gql";
import { locale } from "../../common/shared";

export default {
  components: {
    CheckoutTopSection,
    OrderOverview,
    BillingDetails,
  },
  mixins: [cartMixin],
  data: () => ({
    me: null,
    shippingMethod: null,
    billingAddress: null,
    shippingAddress: null,
    orderComplete: false,
    validBillingForm: false,
    validShippingForm: true,
    showError: false,
  }),
  methods: {
    setValidBillingForm(valid) {
      this.validBillingForm = valid;
    },
    setValidShippingForm(valid) {
      this.validShippingForm = valid;
    },
    updateBilling(billingDetails) {
      this.billingAddress = billingDetails;
    },
    updateShipping(shippingDetails) {
      this.shippingAddress = shippingDetails;
    },
    updateShippingMethod(shippingId) {
      this.shippingMethod = shippingId;
    },
    placeOrder(paymentid, actions) {
      if (this.validBillingForm && this.validShippingForm) {
        this.updateMyCart([
          {
            setBillingAddress: {
              address: this.billingAddress,
            },
          },
        ])
          .then((result) => {
            this.me.activeCart = result.data.updateMyCart;
            if (!this.shippingAddress) {
              return this.updateMyCart([
                {
                  setShippingAddress: {
                    address: this.billingAddress,
                  },
                },
              ]);
            }
            return this.updateMyCart([
              {
                setShippingAddress: {
                  address: this.shippingAddress,
                },
              },
            ]);
          })
          .then((result) => {
            if (paymentid) {
              return this.updateMyCart([
                {
                  addPayment: {
                    payment: {
                      id: paymentid,
                    },
                  },
                },
              ]);
            }
            return result;
          })
          .then((result) => new Promise((resolve) => {
            if (actions && actions.beforeCompleteAsync) {
              actions.beforeCompleteAsync(result)
                .then((updatedResult) => resolve(updatedResult));
            } else {
              resolve(result);
            }
          }))
          .then((result) => {
            this.me.activeCart = result.data.updateMyCart;
            return this.createMyOrder();
          })
          .then(() => {
            this.orderComplete = true;
            if (actions && actions.afterComplete) {
              actions.afterComplete();
            }
          });
      } else {
        this.showError = true;
        if (actions && actions.onValidationError) {
          actions.onValidationError();
        }
      }
    },
  },
  apollo: {
    me: {
      query: gql`
        query me($locale: Locale!) {
          me {
            activeCart {
              ...CartFields
            }
          }
        }
        ${CART_FRAGMENT}
        ${MONEY_FRAGMENT}
        ${ADDRESS_FRAGMENT}
      `,
      variables() {
        return {
          locale: locale(this),
        };
      },
      skip() {
        return !locale(this);
      },
    },
  },
};
