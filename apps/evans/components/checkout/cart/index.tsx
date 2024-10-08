import React from 'react';
import { t } from '@friends-library/locale';
import type { CartItemData } from '../models/CartItem';
import Back from '../Back';
import Progress from '../Progress';
import Header from '../Header';
import CartItem from '../models/CartItem';
import NoProfit from '../NoProfit';
import Item from './Item';
import Button from '@/components/core/Button';

interface Props {
  checkout: () => void;
  onContinueBrowsing: () => void;
  subTotal: number;
  items: CartItemData[];
  setItems: (items: CartItemData[]) => void;
}

const CartComponent: React.FC<Props> = ({
  checkout,
  onContinueBrowsing,
  items,
  setItems,
  subTotal,
}) => (
  <>
    <Header>{t`Your Order`}</Header>
    <NoProfit />
    <Progress step="Order" />
    <div className="ColumnHeadings flex text-gray-900 text-center antialiased mt-6 border-b border-gray-300 pb-2">
      <div className="w-1/2 md:w-3/5 text-left">{t`Item`}</div>
      <div className="w-1/2 md:w-2/5 flex">
        <div className="w-1/2 md:w-1/3">
          <span className="md:hidden">{t`Qty.`}</span>
          <span className="hidden md:inline">{t`Quantity`}</span>
        </div>
        <div className="w-1/2 md:w-1/3">{t`Price`}</div>
        <div className="block w-1/3">{t`Remove`}</div>
      </div>
    </div>
    {items.map((item, index) => (
      <Item
        {...item}
        key={`item-${index}`}
        price={new CartItem(item).price()}
        changeQty={(qty: number) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          items[index]!.quantity = qty;
          setItems([...items]);
        }}
        remove={() => {
          items.splice(index, 1);
          setItems([...items]);
        }}
      />
    ))}
    <div className="text-right font-sans text-lg mb-5 py-4 border-b ">
      <span className="font-bold tracking-wider">{t`Total`}:</span>
      <span className="pl-4 font-sans text-gray-700 text-md md:text-lg antialiased md:tracking-wider">
        ${(subTotal / 100).toFixed(2)}
      </span>
    </div>
    <Back onClick={onContinueBrowsing}>{t`Continue Browsing`}</Back>
    <Button className="mb-5 mx-auto" shadow onClick={checkout}>
      {t`Delivery`} &nbsp;&rsaquo;
    </Button>
  </>
);

export default CartComponent;

export const SubLine: React.FC<{
  children: React.ReactNode;
  label: string;
  className?: string;
}> = ({ label, children, className }) => (
  <div className={`${className || ``} text-gray-700 text-sm flex`}>
    <span className="flex-grow">{label}</span>
    {children}
  </div>
);
