import React, { useState } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import countries from './checkout/countries';
import Input from './checkout/Input';

export interface Props {
  email: string;
  setEmail(newValue: string): unknown;
  name: string;
  setName(newValue: string): unknown;
  street: string;
  setStreet(newValue: string): unknown;
  street2: string;
  setStreet2(newValue: string): unknown;
  city: string;
  setCity(newValue: string): unknown;
  state: string;
  setState(newValue: string): unknown;
  country: string;
  setCountry(newValue: string): unknown;
  zip: string;
  setZip(newValue: string): unknown;
  autoFocusFirst: boolean;
}

const ShippingAddress: React.FC<Props> = ({
  email,
  setEmail,
  name,
  setName,
  street,
  setStreet,
  street2,
  setStreet2,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  zip,
  setZip,
  autoFocusFirst,
}) => {
  const [emailBlurred, setEmailBlurred] = useState<boolean>(false);
  const [nameBlurred, setNameBlurred] = useState<boolean>(false);
  const [streetBlurred, setStreetBlurred] = useState<boolean>(false);
  const [cityBlurred, setCityBlurred] = useState<boolean>(false);
  const [stateBlurred, setStateBlurred] = useState<boolean>(false);
  const [zipBlurred, setZipBlurred] = useState<boolean>(false);
  const [countryBlurred, setCountryBlurred] = useState<boolean>(false);
  return (
    <>
      <Input
        wrapClassName="md:order-1"
        autofocus={autoFocusFirst}
        onChange={(val) => setName(val)}
        onBlur={() => setNameBlurred(true)}
        onFocus={() => setNameBlurred(false)}
        value={name}
        valid={!nameBlurred || !!name}
        placeholder={t`Full name`}
        invalidMsg={t`Name is required`}
        autoComplete="name"
        name="name"
      />
      <Input
        wrapClassName="md:order-3"
        invalidMsg={email ? t`Valid email is required` : t`Email is required`}
        valid={!emailBlurred || !!email.match(/^\S+@\S+$/)}
        onChange={(val) => setEmail(val)}
        onFocus={() => setEmailBlurred(false)}
        onBlur={() => setEmailBlurred(true)}
        value={email}
        placeholder={t`Email`}
        type="email"
      />
      <Input
        wrapClassName="md:order-5"
        onChange={(val) => setStreet(val)}
        onFocus={() => setStreetBlurred(false)}
        onBlur={() => setStreetBlurred(true)}
        value={street}
        placeholder={t`Street address, P.O. Box, C/O`}
        invalidMsg={
          street.trim() === ``
            ? t`Street address is required`
            : t`Must be less than 30 characters`
        }
        valid={!streetBlurred || (!!street && street.length < 30)}
        autoComplete="address-line1"
        name="address"
      />
      <Input
        wrapClassName="md:order-7"
        onChange={(val) => setStreet2(val)}
        value={street2}
        placeholder={t`Apartment, suite, unit, etc.`}
        invalidMsg={t`Must be less than 30 characters`}
        valid={street2.length < 30}
        autoComplete="address-line2"
      />
      <Input
        wrapClassName="md:order-2"
        invalidMsg={t`City is required`}
        valid={!cityBlurred || !!city}
        onChange={(val) => setCity(val)}
        onFocus={() => setCityBlurred(false)}
        onBlur={() => setCityBlurred(true)}
        value={city}
        placeholder={t`City`}
        autoComplete="locality"
        name="city"
      />
      <Input
        wrapClassName="md:order-4"
        invalidMsg={t`State / Province / Region is required`}
        valid={!stateBlurred || !!state}
        onChange={(val) => setState(val)}
        onFocus={() => setStateBlurred(false)}
        onBlur={() => setStateBlurred(true)}
        value={state}
        placeholder={t`State / Province / Region`}
        autoComplete="shippping region"
        name="region"
      />
      <Input
        wrapClassName="md:order-6"
        invalidMsg={t`ZIP / Postal Code is required`}
        valid={!zipBlurred || !!zip}
        onChange={(val) => setZip(val)}
        onFocus={() => setZipBlurred(false)}
        onBlur={() => setZipBlurred(true)}
        value={zip}
        placeholder={t`ZIP / Postal Code`}
        autoComplete="postal-code"
        name="postal"
      />
      <select
        value={country}
        className={cx(
          `CartInput text-gray-500 md:order-last`,
          countryBlurred && !country && `invalid text-red-600`,
        )}
        onBlur={() => setCountryBlurred(true)}
        onChange={(e) => setCountry(e.target.value)}
        autoComplete="country"
        name="country"
      >
        <option value="">
          {!countryBlurred || country ? t`Select Country` : t`Select a Country`}
        </option>
        {(Object.keys(countries) as Array<keyof typeof countries>).map((code) => (
          <option key={code} value={code}>
            {countries[code]}
          </option>
        ))}
      </select>
    </>
  );
};

export default ShippingAddress;
