import { ReallySmallEvents as EventEmitter } from 'really-small-events';
import type { CartItemData } from './CartItem';
import type { Address } from '@/lib/types';
import CartItem from './CartItem';
import { isAddress, isItem } from './integrity';

interface CartData {
  items: CartItemData[];
  address?: Address;
  email?: string;
}

export default class Cart extends EventEmitter {
  public static fromJson(json: unknown): Cart {
    if (typeof json !== `object` || json === null) {
      return new Cart([]);
    }

    try {
      const { items, address, email } = json as Record<string, unknown>;

      let validEmail: string | undefined;
      if (typeof email === `string`) {
        validEmail = email;
      }

      let validAddress: Address | undefined;
      if (isAddress(address)) {
        validAddress = address;
      }

      let validItems: CartItemData[] = [];
      if (Array.isArray(items)) {
        validItems = items.filter(isItem);
      }

      return new Cart(
        validItems.map((d) => new CartItem(d)),
        validAddress,
        validEmail,
      );
    } catch (err) {
      return new Cart([]);
    }
  }

  public constructor(
    private _items: CartItem[],
    public address?: Address,
    public email?: string,
  ) {
    super();
  }

  public set items(items: CartItem[]) {
    this._items = items;
    this.trigger(`change`);
  }

  public get items(): CartItem[] {
    return this._items;
  }

  public numItems(): number {
    return this.items.length;
  }

  public totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public addItem(newItem: CartItem): void {
    for (const item of this.items) {
      if (item.equals(newItem)) {
        item.quantity++;
        this.trigger(`change`);
        this.trigger(`add-item`);
        return;
      }
    }
    this._items.push(newItem);
    this.trigger(`change`);
    this.trigger(`add-item`);
  }

  public subTotal(): number {
    return this.items.reduce((st, item) => st + item.price() * item.quantity, 0);
  }

  public toJSON(): CartData {
    return {
      items: this.items.map((item) => item.toJSON()),
      ...(this.address ? { address: this.address } : {}),
      ...(this.email ? { email: this.email } : {}),
    };
  }
}
