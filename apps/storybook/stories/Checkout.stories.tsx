import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import WebCoverStyles from 'decorators/CoverStyles';
import Delivery from '@evans/checkout/Delivery';
import Payment from '@evans/checkout/Payment';
import Input from '@evans/forms/Input';
import EmptyCart from '@evans/checkout/EmptyCart';
import UnrecoverableError from '@evans/checkout/UnrecoverableError';
import Progress from '@evans/checkout/Progress';
import Confirmation from '@evans/checkout/Confirmation';
import type { Meta } from '@storybook/react';

export default {
  title: 'Checkout/Components', // eslint-disable-line
  parameters: { layout: `fullscreen` },
  decorators: [
    WebCoverStyles,
    (Story) => (
      <div className="max-w-screen-lg p-8">
        <Story />
      </div>
    ),
  ],
} as Meta;

export const Empty_Cart = () => <EmptyCart />;

export const Payment_ = () => (
  // @ts-ignore
  <StripeProvider apiKey={`pk_test_51H`}>
    {/* @ts-ignore */}
    <Elements>
      <Payment
        throbbing={false}
        onPay={() => {}}
        onBack={() => {}}
        subTotal={1298}
        shipping={399}
        taxes={132}
        ccFeeOffset={42}
        handling={150}
        paymentIntentClientSecret="pi_123_secret_345"
      />
    </Elements>
  </StripeProvider>
);

export const PaymentThrobbing = () => (
  // @ts-ignore
  <StripeProvider apiKey={`pk_test_51H`}>
    {/* @ts-ignore */}
    <Elements>
      <Payment
        throbbing={true}
        onPay={() => {}}
        onBack={() => {}}
        subTotal={1298}
        shipping={399}
        taxes={132}
        ccFeeOffset={42}
        handling={150}
        paymentIntentClientSecret="pi_123_secret_345"
      />
    </Elements>
  </StripeProvider>
);

export const ProgressOrder = () => <Progress step="Order" />;
export const ProgressDelivery = () => <Progress step="Delivery" />;
export const ProgressPayment = () => <Progress step="Payment" />;
export const ProgressConfirmation = () => <Progress step="Confirmation" />;

export const InputValid = () => (
  <div style={{ width: 300 }}>
    <Input
      valid={true}
      onChange={() => {}}
      placeholder="Credit Card #"
      invalidMsg="Invalid Credit Card Number"
    />
  </div>
);

export const InputInvalid = () => (
  <div style={{ width: 300 }}>
    <Input
      valid={false}
      onChange={() => {}}
      placeholder="Credit Card #"
      invalidMsg="Invalid Credit Card Number"
    />
  </div>
);

export const InputInvalidValue = () => (
  <div style={{ width: 300 }}>
    <Input
      valid={false}
      onChange={() => {}}
      placeholder="Credit Card #"
      value="444"
      invalidMsg="Invalid Credit Card Number"
    />
  </div>
);

export const Confirmation_ = () => (
  <Confirmation email="you@example.com" onClose={() => {}} />
);

export const Delivery_ = () => <Delivery onBack={() => {}} onSubmit={() => {}} />;

export const DeliveryImpossible = () => (
  <Delivery
    error={{ case: `shipping_not_possible` }}
    onBack={() => {}}
    onSubmit={() => {}}
  />
);

export const ShippingAddressError = () => (
  <Delivery
    error={{
      case: `shipping_address_error`,
      message: `Invalid name, no one named "Richard" may order books from Friends Library`,
    }}
    onBack={() => {}}
    onSubmit={() => {}}
  />
);

export const DeliveryThrobbing = () => (
  <Delivery throbbing onBack={() => {}} onSubmit={() => {}} />
);

export const UnrecoverableError_ = () => (
  <UnrecoverableError onClose={() => {}} onRetry={() => {}} />
);
