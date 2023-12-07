import React from 'react';
import { t } from '@friends-library/locale';

interface Props {
  subTotal: number;
  shipping: number;
  handling: number;
  taxes: number;
  ccFeeOffset: number;
  className: string;
}

const Fees: React.FC<Props> = ({
  className,
  subTotal,
  shipping,
  taxes,
  ccFeeOffset,
  handling,
}) => (
  <table className={`${className} border-spacing-0 border-separate border-gray-400`}>
    <tbody>
      <tr className="even:bg-gray-100">
        <Cell>{t`Subtotal`}</Cell>
        <Cell>{money(subTotal)}</Cell>
      </tr>
      <tr className="even:bg-gray-100">
        <Cell>{t`Shipping`}</Cell>
        <Cell>{money(shipping)}</Cell>
      </tr>
      <tr className="even:bg-gray-100">
        <Cell>{t`Handling Fee`}</Cell>
        <Cell>{money(handling)}</Cell>
      </tr>
      <tr className="even:bg-gray-100">
        <Cell>{t`Credit Card Fee Offset`}</Cell>
        <Cell>{money(ccFeeOffset)}</Cell>
      </tr>
      {taxes > 0 && (
        <tr className="even:bg-gray-100">
          <Cell>{t`Taxes`}</Cell>
          <Cell>{money(taxes)}</Cell>
        </tr>
      )}
      <tr className="text-black font-bold even:bg-gray-100">
        <Cell>{t`Grand Total`}</Cell>
        <Cell>{money(subTotal + shipping + taxes + ccFeeOffset)}</Cell>
      </tr>
    </tbody>
  </table>
);

export default Fees;

const Cell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="p-3 text-sm text-gray-700 antialiased last:text-right">{children}</td>
);

function money(amt: number): string {
  return `$${(amt / 100).toFixed(2)}`;
}
