import Vuelidate from 'vuelidate';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import CreditCardForm from '@/components/checkout/PaymentMethod/Cybersource/Cybersource';
import CreditCardFormVue from '@/components/checkout/PaymentMethod/Cybersource/Cybersource.vue';
const $route = 
{
  params: {country:'US'}
} 

const localVue = createLocalVue();
localVue.use(Vuelidate);
window.alert = jest.fn();

describe('CreditCardForm/index.vue', () => {
  let options;

  beforeEach(() => {
    options = {
      localVue,
      mocks: {$t: jest.fn(),$route},
      data: () => ({
        PaymentMethods: {
          flexMicroform: {
            flexMicroFormObject: null,
        captureContext: null,
        jsLoaded: false
          },
        }
      })
    };
  });

  /* it('Vue loaded', async (done) => {
    const wrapper = shallowMount(CreditCardFormVue, options);
    done();
    // eslint-disable-next-line no-console
    console.log(wrapper);
    await CreditCardForm.methods.renderFlex();
    expect(await CreditCardForm.methods.appendFlexJS()).resolves.toBe(true);
  }, 3000); */

it('appendFlexJS is loaded', async (done) => {
  const wrapper = shallowMount(CreditCardFormVue, options);
  done();
  // eslint-disable-next-line no-console
  console.log(wrapper);
  // eslint-disable-next-line no-console
  console.log("before execution");
  await CreditCardForm.methods.renderFlex();
  // eslint-disable-next-line no-console
  console.log(options.PaymentMethods.flexMicroform.flexMicroFormObject);
  // eslint-disable-next-line no-console
  console.log("after execution");
  expect(options.PaymentMethods.flexMicroform.flexMicroFormObject).resolves.toBe(true);
}, 3000);

 /* it('renderFlex is loaded', async (done) => {
  const wrapper = shallowMount(CreditCardForm, options);
  done();
  // eslint-disable-next-line no-console
 // await wrapper.find('button.yes').trigger('click');
 await wrapper.vm.renderFlex();
  expect(await wrapper.renderFlex()).resolves.toBe(true);
}, 3000); */  
})