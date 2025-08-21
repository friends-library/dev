import React, { useState } from 'react';
import WebCoverStyles from 'decorators/CoverStyles';
import CartModel from '@evans/checkout/models/Cart';
import CartComponent from '@evans/checkout/cart';
import CartItemComponent from '@evans/checkout/cart/Item';
import { cartItemsData, cartItemData3 } from '@evans/checkout/models/__tests__/fixtures';
import CartItemModel from '@evans/checkout/models/CartItem';
import type { CartItemData } from '@evans/checkout/models/CartItem';
import type { Meta } from '@storybook/nextjs';

export default {
  title: 'Checkout/Cart', // eslint-disable-line
  decorators: [WebCoverStyles],
} as Meta;

export const Cart = () => <StatefulCart />;
export const CartItem = () => <StatefulCartItem />;

const StatefulCart: React.FC = () => {
  const cart = CartModel.fromJson({ items: [...cartItemsData(), cartItemData3()] });
  const [items, setItems] = useState<CartItemData[]>(cart.items.map((i) => i.toJSON()));
  return (
    <CartComponent
      subTotal={cart.subTotal()}
      items={items}
      setItems={(items) => {
        cart.items = items.map((i) => new CartItemModel(i));
        setItems(items);
      }}
      checkout={() => {}}
      onContinueBrowsing={() => {}}
    />
  );
};

const StatefulCartItem: React.FC = () => {
  const [qty, setQty] = useState<number>(1);
  const data = cartItemData3();
  return (
    <CartItemComponent
      edition="updated"
      isCompilation={false}
      isbn="1234567890"
      printSize="m"
      displayTitle={data.displayTitle}
      title={data.title}
      author={data.author}
      quantity={qty}
      price={422}
      changeQty={setQty}
      remove={() => {}}
    />
  );
};
