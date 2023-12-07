import React from 'react';
import Modal from '../forms/Modal';
import CartStore from './services/CartStore';
import CheckoutApi from './services/CheckoutApi';
import CheckoutService from './services/CheckoutService';
import CheckoutMachine from './services/CheckoutMachine';
import CheckoutFlow from './Flow';
import ErrorBoundary from '@/components/core/ErrorBoundary';

const store = CartStore.getSingleton();
const api = new CheckoutApi();
const service = new CheckoutService(store.cart, api);
const machine = new CheckoutMachine(service);
machine.on(`close`, () => store.close());

const Checkout: React.FC = () => (
  <Modal onClose={() => machine.close()}>
    <ErrorBoundary location="checkout">
      <CheckoutFlow machine={machine} />
    </ErrorBoundary>
  </Modal>
);

export default Checkout;
