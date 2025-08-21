import React from 'react';
import WebCoverStyles from 'decorators/CoverStyles';
import Modal from '@evans/forms/Modal';
import CheckoutMachine from '@evans/checkout/services/CheckoutMachine';
import CheckoutService from '@evans/checkout/services/CheckoutService';
import CheckoutFlow from '@evans/checkout/Flow';
import { cartPlusData, cart } from '@evans/checkout/models/__tests__/fixtures';
import type Cart from '@evans/checkout/models/Cart';
import type { Meta } from '@storybook/nextjs';
import MockCheckoutApi from './MockCheckoutApi';

export default {
  title: 'Checkout/Flow', // eslint-disable-line
  decorators: [WebCoverStyles],
} as Meta;

export const Prefilled = () => (
  <Modal onClose={() => {}}>
    <CheckoutFlow machine={machine()} />
  </Modal>
);

export const NotPrefilled = () => (
  <Modal onClose={() => {}}>
    <CheckoutFlow machine={machine(cart())} />
  </Modal>
);

export const ShippingImpossible = () => {
  const api = new MockCheckoutApi(1000);
  api.responses.getExploratoryMetadata.push({ status: `shipping_not_possible` });
  const service = new CheckoutService(cartPlusData(), api);
  const machine = new CheckoutMachine(service);
  return (
    <Modal onClose={() => {}}>
      <CheckoutFlow machine={machine} />
    </Modal>
  );
};

export const CreateOrderFail = () => {
  const api = new MockCheckoutApi(1000);
  api.responses.createOrder.push(false);
  const service = new CheckoutService(cartPlusData(), api);
  const machine = new CheckoutMachine(service);
  return (
    <Modal onClose={() => {}}>
      <CheckoutFlow machine={machine} />
    </Modal>
  );
};

function machine(cart: Cart = cartPlusData()): CheckoutMachine {
  const service = new CheckoutService(cart, new MockCheckoutApi(1000));
  return new CheckoutMachine(service);
}
