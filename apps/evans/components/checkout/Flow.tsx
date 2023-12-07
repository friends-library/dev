import React, { useState, useEffect } from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import type { CartItemData } from './models/CartItem';
import type CheckoutMachine from './services/CheckoutMachine';
import Cart from './cart';
import Delivery from './Delivery';
import Payment from './Payment';
import Confirmation from './Confirmation';
import UnrecoverableError from './UnrecoverableError';
import CartItem from './models/CartItem';
import EmptyCart from './EmptyCart';
import { LANG } from '@/lib/env';

type Props = { machine: CheckoutMachine };

const CheckoutFlow: React.FC<Props> = ({ machine }) => {
  const cart = machine.service.cart;
  const [state, setState] = useState<string>(machine.getState());
  const [cartItems, setCartItems] = useState<CartItemData[]>(
    cart.items.map((i) => i.toJSON()),
  );

  useEffect(() => {
    machine.on(`state:change`, setState);
    return () => {
      machine.off(`state:change`, setState);
    };
  }, [machine]);

  switch (state) {
    case `cart`:
      if (cartItems.length === 0) {
        return <EmptyCart />;
      }
      return (
        <Cart
          items={cartItems}
          setItems={(items) => {
            cart.items = items.map((i) => new CartItem(i));
            setCartItems(items);
          }}
          subTotal={cart.subTotal()}
          checkout={() => machine.dispatch(`next`)}
          onContinueBrowsing={() => machine.dispatch(`continueBrowsing`)}
        />
      );
    case `delivery`:
    case `calculateFees`:
    case `createPaymentIntent`:
      return (
        <Delivery
          throbbing={state !== `delivery`}
          onBack={() => machine.dispatch(`back`)}
          error={!!cart.address?.unusable}
          stored={{ ...cart.address, ...(cart.email ? { email: cart.email } : {}) }}
          onSubmit={(data) => {
            const { email, ...address } = data;
            cart.email = email;
            cart.address = address;
            machine.dispatch(`next`);
          }}
        />
      );
    case `payment`:
    case `chargeCreditCard`:
    case `createOrder`:
      return (
        // @ts-ignore
        <StripeProvider
          apiKey={
            (process.env.NEXT_PUBLIC_VERCEL_ENV === `production`
              ? process.env.NEXT_PUBLIC_PROD_STRIPE_PUBLISHABLE_KEY
              : process.env.NEXT_PUBLIC_TEST_STRIPE_PUBLISHABLE_KEY) || ``
          }
        >
          {/* @ts-ignore */}
          <Elements locale={LANG}>
            <Payment
              throbbing={state !== `payment`}
              error={machine.service.popStripeError()}
              onBack={() => machine.dispatch(`back`)}
              paymentIntentClientSecret={machine.service.paymentIntentClientSecret}
              subTotal={cart.subTotal()}
              shipping={machine.service.metadata.shipping}
              taxes={machine.service.metadata.taxes}
              ccFeeOffset={machine.service.metadata.ccFeeOffset}
              handling={machine.service.metadata.fees}
              onPay={(chargeCard) => machine.dispatch(`next`, chargeCard)}
            />
          </Elements>
        </StripeProvider>
      );
    case `confirmation`:
      return (
        <Confirmation
          email={cart.email || ``}
          onClose={() => machine.dispatch(`finish`)}
        />
      );
    case `brickSession`:
      return (
        <UnrecoverableError
          onRetry={() => machine.dispatch(`tryAgain`)}
          onClose={() => machine.dispatch(`close`)}
        />
      );
    default:
      return null;
  }
};

export default CheckoutFlow;
