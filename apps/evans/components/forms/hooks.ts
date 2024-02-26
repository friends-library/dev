import { useState } from 'react';
import type { AddressWithEmail } from '@/lib/types';
import type { Props as AddressProps } from './ShippingAddress';

export function useAddress(
  initial: Partial<AddressWithEmail>,
): [
  props: Omit<AddressProps, 'autoFocusFirst'>,
  address: AddressWithEmail,
  isValid: boolean,
] {
  const [email, setEmail] = useState<string>(initial.email || ``);
  const [name, setName] = useState<string>(initial.name || ``);
  const [street, setStreet] = useState<string>(initial.street || ``);
  const [street2, setStreet2] = useState<string>(initial.street2 || ``);
  const [city, setCity] = useState<string>(initial.city || ``);
  const [state, setState] = useState<string>(initial.state || ``);
  const [zip, setZip] = useState<string>(initial.zip || ``);
  const [country, setCountry] = useState<string>(initial.country || ``);
  return [
    {
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
      zip,
      setZip,
      country,
      setCountry,
    },
    {
      email,
      name,
      street,
      street2,
      city,
      state,
      zip,
      country,
    },
    !!(
      name.trim().length > 0 &&
      street.trim().length > 0 &&
      street.length < 30 &&
      street2.length < 30 &&
      city.trim().length > 0 &&
      state.trim().length > 0 &&
      zip.trim().length > 0 &&
      country.trim().length > 0 &&
      email.includes(`@`)
    ),
  ];
}
