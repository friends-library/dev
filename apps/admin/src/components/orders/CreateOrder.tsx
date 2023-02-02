import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import omit from 'lodash.omit';
import {
  PlusCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CloudUploadIcon,
} from '@heroicons/react/solid';
import * as orders from '../../lib/api/orders';
import type { OrderAddress, OrderItem } from '../../types';
import SelectBook from './SelectBook';
import EmptyWell from '../EmptyWell';
import PillButton from '../PillButton';
import TextInput from '../TextInput';
import LabeledSelect from '../LabeledSelect';
import COUNTRIES from '../../lib/countries';
import * as price from '../../lib/price';
import Button from '../Button';
import InfoMessage from '../InfoMessage';
import { Link } from 'react-router-dom';

const CreateOrder: React.FC = () => {
  const [selectingBook, setSelectingBook] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [checkingAddress, setCheckingAddress] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [submitResult, setSubmitResult] = useState<Result<string> | null>(null);
  const [email, setEmail] = useState(``);
  const [requestId, setRequestId] = useState(``);
  const [address, setAddress] = useState<OrderAddress>(emptyAddress());

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requestId = query.get(`request`);
    if (!requestId) return;
    setRequestId(requestId);
    orders.getFreeOrderRequest(requestId).then((result) => {
      if (!result.success) {
        alert(`Failed to retrieve order data for id=${requestId}`);
        return;
      }
      setEmail(result.value.email);
      setAddress(omit(result.value.address, `__typename`));
    });
  }, []);

  if (selectingBook) {
    return (
      <Constrained to={`w-[550px]`}>
        <SelectBook
          onCancel={() => setSelectingBook(false)}
          onSelect={(item) => {
            setItems([...items, item]);
            setSelectingBook(false);
          }}
        />
      </Constrained>
    );
  }

  const addressIsValid = addressValid(address, email);

  return (
    <Constrained to={`w-[550px]`}>
      <h1 className="text-flprimary font-sans font-bold text-3xl uppercase text-center antialiased">
        Create Order
      </h1>
      <div>
        <h2 className="text-xl font-semibold my-4">Books:</h2>
        {items.length === 0 && (
          <EmptyWell small>
            No books added. Click the <span className="text-flprimary">Add Book</span>
            {` `}
            button below to get started.
          </EmptyWell>
        )}
        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                className="flex p-1 items-center space-x-3 bg-[#efefef] rounded-md"
                key={item.id}
              >
                <img height="80" width="55" src={item.image} alt="" />
                <div className="-mt-1">
                  <h3>{item.displayTitle}</h3>
                  <h4 className="font-serif text-gray-600 italic antialiased">
                    {item.author}
                  </h4>
                </div>
                <div className="flex-grow pr-4 flex justify-end space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <code className="antialiased select-none">{item.quantity}</code>
                    <div className="flex flex-col -translate-y-0.5 select-none">
                      <ChevronUpIcon
                        onClick={makeQuantityIncrement(item, items, setItems, `+`)}
                        className="cursor-pointer mt-0.5 mx-1 bg-xgray-400 text-gray-500 rounded-full w-[15px] h-[15px]"
                      />
                      <ChevronDownIcon
                        onClick={makeQuantityIncrement(item, items, setItems, `-`)}
                        className="cursor-pointer mt-0.5 mx-1 bg-xgray-400 text-gray-500 rounded-full w-[15px] h-[15px]"
                      />
                    </div>
                  </div>
                  <XCircleIcon
                    onClick={() => setItems([...items.filter((i) => i.id !== item.id)])}
                    className="translate-y-1.5 w-[20px] h-[20px] text-red-800"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex my-3 items-center justify-between">
          <code
            className={cx(
              items.length === 0 && `opacity-0`,
              `text-xs ml-1 text-red-800 antialiased`,
            )}
          >
            Subtotal: {price.formatted(price.subtotal(items))}
          </code>
          <PillButton
            Icon={PlusCircleIcon}
            className="ml-auto"
            onClick={() => setSelectingBook(true)}
          >
            Add Book
          </PillButton>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3 mt-8">Address:</h2>
        <div className="space-y-3.5">
          <TextInput
            type="text"
            label="Name"
            placeholder="John Doe"
            value={address.name}
            onChange={(newValue) => setAddress({ ...address, name: newValue })}
          />
          <TextInput
            type="email"
            label="Email"
            placeholder="you@example.com  —  tracking links will be sent here"
            value={email}
            onChange={(newValue) => setEmail(newValue)}
          />
          <TextInput
            type="text"
            label="Address"
            placeholder="Street Address, P.O. Box, C/O"
            value={address.street}
            isValid={(val) => val.length <= 30}
            invalidMessage="Must be 30 characters or less"
            onChange={(newValue) => setAddress({ ...address, street: newValue })}
          />
          <TextInput
            type="text"
            label="Address (continued)"
            placeholder="Apartment, suite, unit, etc"
            optional
            isValid={(val) => val.length <= 30}
            invalidMessage="Must be 30 characters or less"
            value={address.street2 ?? ``}
            onChange={(newValue) => setAddress({ ...address, street2: newValue })}
          />
          <TextInput
            type="text"
            label="City"
            placeholder="City"
            value={address.city}
            onChange={(newValue) => setAddress({ ...address, city: newValue })}
          />
          <TextInput
            type="text"
            label="State"
            placeholder="State / Province / Region"
            value={address.state}
            onChange={(newValue) => setAddress({ ...address, state: newValue })}
          />
          <TextInput
            type="text"
            label="Zip"
            placeholder="Zip / Postal Code"
            value={address.zip}
            onChange={(newValue) => setAddress({ ...address, zip: newValue })}
          />
          <LabeledSelect
            label="Country"
            selected={address.country}
            setSelected={(newValue) => setAddress({ ...address, country: newValue })}
            options={countries}
          />
          <TextInput
            type="text"
            label="Request ID"
            optional
            placeholder="12034482-5410-4db7-a9f3-c12f34565a55"
            value={requestId}
            onChange={(newValue) => setRequestId(newValue)}
          />
        </div>
        <div className="flex my-3">
          <PillButton
            Icon={CheckCircleIcon}
            className={cx(
              (!addressIsValid || checkingAddress) && `cursor-not-allowed opacity-30`,
              `ml-auto`,
            )}
            onClick={async () => {
              if (!addressIsValid) return;
              setCheckingAddress(true);
              const checkResult = await orders.isAddressValid(address);
              setCheckingAddress(false);
              setTimeout(() => {
                if (checkResult.success) {
                  alert(`✅ Address was accepted.`);
                } else {
                  alert(`🚨 No bueno! ${checkResult.error}.`);
                }
              }, 10);
            }}
          >
            {checkingAddress ? `Checking...` : `Check Address`}
          </PillButton>
        </div>
        <Button
          disabled={items.length === 0 || !addressIsValid || submittingOrder}
          className="my-8"
          type="button"
          fullWidth
          onClick={async () => {
            setSubmittingOrder(true);
            const result = await orders.createOrder(address, items, email, requestId);
            setSubmittingOrder(false);
            setSubmitResult(result);
            if (result.success) {
              setItems([]);
              setAddress(emptyAddress());
              setEmail(``);
              const refresh = requestId.trim() !== ``;
              setRequestId(``);
              setTimeout(() => {
                setSubmitResult(null);
                refresh && (window.location.href = `/`);
              }, 10000);
            }
          }}
        >
          <CloudUploadIcon className="w-5 h-5 mr-2" />
          {submittingOrder ? `Submitting...` : `Submit Order`}
        </Button>
        {submitResult?.success === true && (
          <InfoMessage type="success">
            Success! Order{` `}
            <Link to={`/orders/${submitResult.value}`}>
              <code className="text-blue-500">{submitResult.value}</code>
            </Link>
            {` `}
            created.
          </InfoMessage>
        )}
        {submitResult?.success === false && (
          <InfoMessage type="error">
            Error submitting order: {submitResult.error}
          </InfoMessage>
        )}
      </div>
    </Constrained>
  );
};

export default CreateOrder;

const countries = Object.entries(COUNTRIES);

function addressValid(address: OrderAddress, email: string): boolean {
  if (email.length < 4 || !email.includes(`@`)) {
    return false;
  }

  for (const [key, value] of Object.entries(address)) {
    const trimmed = (value as string | undefined)?.trim();
    const length = trimmed?.length || 0;
    switch (key) {
      case `country`:
        if (length !== 2) {
          return false;
        }
        break;
      case `street`:
        if (length > 30) {
          return false;
        }
        break;
      case `street2`:
        if (trimmed !== undefined && trimmed !== `` && (length < 2 || length > 30)) {
          return false;
        }
        break;
      default:
        if (length < 2) {
          return false;
        }
    }
  }
  return true;
}

function makeQuantityIncrement(
  item: OrderItem,
  items: OrderItem[],
  setItems: (items: OrderItem[]) => unknown,
  dir: '+' | '-',
): () => void {
  return () => {
    const newQty = Math.max(1, item.quantity + (dir === `+` ? 1 : -1 * 1));
    setItems([...items.filter((i) => i.id !== item.id), { ...item, quantity: newQty }]);
  };
}

function emptyAddress(): OrderAddress {
  return {
    name: ``,
    street: ``,
    street2: ``,
    city: ``,
    state: ``,
    zip: ``,
    country: `US`,
  };
}

const Constrained: React.FC<{ to: string }> = ({ to, children }) => (
  <div className="flex justify-center">
    <div className={to}>{children}</div>
  </div>
);
