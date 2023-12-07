import { ReallySmallEvents as EventEmitter } from 'really-small-events';
import Cookies from 'js-cookie';
import Cart from '../models/Cart';

export default class CartStore extends EventEmitter {
  private _isOpen = false;
  private stripeLoaded = false;
  public cart: Cart;

  public constructor() {
    super();
    this.cart = new Cart([]);

    try {
      const stored = JSON.parse(Cookies.get(`flp-cart`) || ``);
      if (stored) {
        this.cart = Cart.fromJson(stored);
      }
    } catch (e) {
      // ¯\_(ツ)_/¯
    }

    this.cart.on(`change`, () => {
      Cookies.set(`flp-cart`, JSON.stringify(this.cart.toJSON()));
      this.trigger(`cart:changed`);
    });

    this.cart.on(`add-item`, () => this.trigger(`cart:item-added`));
  }

  public isOpen(): boolean {
    return this._isOpen;
  }

  public close(): void {
    this._isOpen = false;
    this.trigger(`hide`);
    this.trigger(`toggle:visibility`, false);
  }

  public open(): void {
    this._isOpen = true;
    this.trigger(`show`);
    this.trigger(`toggle:visibility`, true);
    if (!this.stripeLoaded) {
      this.loadStripe();
    }
  }

  public static getSingleton(): CartStore {
    if (!singleton) {
      singleton = new CartStore();
    }
    return singleton;
  }

  private loadStripe(): void {
    const script = document.createElement(`script`);
    script.src = `https://js.stripe.com/v3/`;
    document.head.appendChild(script);
    this.stripeLoaded = true;
  }
}

let singleton: CartStore | undefined;
