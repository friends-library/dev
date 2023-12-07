import React, { useState, useReducer, useEffect } from 'react';
import cx from 'classnames';
import dynamic from 'next/dynamic';
import CartStore from '../checkout/services/CartStore';
import PopUnder from '../core/PopUnder';
import Dual from '../core/Dual';
import { useNumCartItems } from '../checkout/hooks';
import Nav from './Nav';
import Slideover from './Slideover';
import Footer from './Footer';
import { appReducer, appInitialState, AppDispatch } from '@/lib/app-state';
import { FIXED_TOPNAV_HEIGHT } from '@/lib/scroll';

interface Props {
  children: React.ReactNode;
}

const store = CartStore.getSingleton();

const Checkout = dynamic(() => import(`../checkout/Checkout`), {
  loading: () => <div className="fixed bg-white inset-0" />,
});

const RequestFreeBooks = dynamic(() => import(`../forms/RequestFreeBooks`), {
  loading: () => <div className="fixed bg-white inset-0" />,
});

const Chrome: React.FC<Props> = ({ children }) => {
  const [slideoverOpen, setSlideoverOpen] = useState(false);
  const [itemJustAdded, setItemJustAdded] = useState(false);
  const [appState, dispatch] = useReducer(appReducer, appInitialState);
  const [numCartItems] = useNumCartItems();

  useEffect(() => {
    function onCartItemAdded(): void {
      setItemJustAdded(true);
      setTimeout(() => setItemJustAdded(false), 4000);
    }
    function setCheckoutModalOpen(open: boolean): void {
      dispatch(open ? { type: `show--modal:checkout` } : { type: `show--app` });
    }
    store.on(`toggle:visibility`, setCheckoutModalOpen);
    store.on(`cart:item-added`, onCartItemAdded);
    return () => {
      store.off(`toggle:visibility`, setCheckoutModalOpen);
      store.off(`cart:item-added`, onCartItemAdded);
    };
  }, []);

  return (
    <AppDispatch.Provider value={dispatch}>
      {itemJustAdded && (
        <PopUnder
          alignRight
          style={{
            position: `fixed`,
            right: 6,
            top: FIXED_TOPNAV_HEIGHT + 3,
            zIndex: 1000,
          }}
          bgColor="flprimary"
        >
          <Dual.P className="text-white px-8 py-4 font-sans antialiased">
            <>An item was added to your cart</>
            <>Un artículo fue añadido a tu carrito</>
          </Dual.P>
        </PopUnder>
      )}
      {appState.view === `modal:checkout` && <Checkout />}
      {appState.view === `modal:request-free` && (
        <RequestFreeBooks currentPageBook={appState.book} />
      )}
      {appState.view === `app` && (
        <div className="relative">
          <div
            className={cx(
              `fixed w-full h-full z-50 top-0 left-0 transition-[backdrop-filter,background-color] duration-200`,
              slideoverOpen
                ? `bg-black/30 backdrop-blur-sm pointer-events-auto`
                : `pointer-events-none`,
            )}
            onClick={() => setSlideoverOpen(false)}
          >
            <Slideover close={() => setSlideoverOpen(false)} isOpen={slideoverOpen} />
          </div>
          <Nav
            showCartBadge={numCartItems > 0}
            onCartBadgeClick={() => store.open()}
            onHamburgerClick={() => setSlideoverOpen(true)}
          />
          <main className="pt-[70px]">{children}</main>
          <Footer />
        </div>
      )}
    </AppDispatch.Provider>
  );
};

export default Chrome;
