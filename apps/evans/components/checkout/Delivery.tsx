import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import type { AddressWithEmail } from '@/lib/types';
import ShippingAddress from '../forms/ShippingAddress';
import { useAddress } from '../forms/hooks';
import MessageThrobber from '../forms/MessageThrobber';
import Header from './Header';
import Progress from './Progress';
import Back from './Back';
import NoProfit from './NoProfit';
import ErrorMsg from './ErrorMsg';
import Button from '@/components/core/Button';
import Dual from '@/components/core/Dual';

interface Props {
  onSubmit(address: AddressWithEmail): unknown;
  onBack(): unknown;
  stored?: Partial<AddressWithEmail>;
  throbbing?: boolean;
  error?:
    | { case: `shipping_not_possible` }
    | { case: `shipping_address_error`; message: string };
}

const Delivery: React.FC<Props> = ({
  onSubmit,
  onBack,
  stored = {},
  error,
  throbbing,
}) => {
  const [addressProps, addressWithEmail, addressValid] = useAddress(stored);

  return (
    <div className={cx(throbbing && `pointer-events-none`)}>
      <Header>{t`Delivery`}</Header>
      {!error && <NoProfit className="hidden md:block" />}
      <Progress step="Delivery" />
      {error && error.case === `shipping_not_possible` && <ShippingImpossibleError />}
      {error && error.case === `shipping_address_error` && (
        <ErrorMsg>{error.message}</ErrorMsg>
      )}
      <form
        className="mt-8 relative"
        onSubmit={(e) => {
          e.preventDefault();
          if (addressValid && !throbbing) {
            onSubmit(addressWithEmail);
          }
        }}
      >
        {throbbing && <MessageThrobber />}
        <div
          className={cx(
            `InputWrap md:flex flex-wrap justify-between`,
            throbbing && `blur`,
          )}
        >
          <ShippingAddress {...addressProps} autoFocusFirst={!throbbing} />
        </div>
        <Back className={cx(throbbing && `blur`)} onClick={onBack}>
          {t`Back to Order`}
        </Back>
        <Button shadow className="mx-auto" disabled={!addressValid || throbbing}>
          {t`Payment`} &nbsp;&rsaquo;
        </Button>
      </form>
    </div>
  );
};

export default Delivery;

const ShippingImpossibleError: React.FC = () => (
  <ErrorMsg>
    <Dual.Frag>
      <>
        Sorry, we’re not able to ship to that address. Sometimes using an{` `}
        <i>abbreviation</i> for the state/province/region makes a difference. If not,
        please double-check for any errors, or try an <i>alternate address</i> where you
        could receive a shipment. Still no luck? We might not be able to ship directly to
        your location, but you can{` `}
        <Link href={t`/contact`} className="underline">
          contact us
        </Link>
        {` `}
        to arrange an alternate shipment.
      </>
      <>
        Lo sentimos, no podemos hacer envíos a esa dirección. Por favor, comprueba si hay
        algún <em>error,</em> o intenta una <em>dirección alternativa</em> donde puedas
        recibir el envío. ¿Todavía no lo has logrado? Es posible que no podamos enviar
        directamente a esa ubicación, pero{` `}
        <Link href={t`/contact`} className="underline">
          contáctanos
        </Link>
        {` `}
        para acordar un envío alternativo.
      </>
    </Dual.Frag>
  </ErrorMsg>
);
