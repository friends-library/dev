import React from 'react';
import { notFound } from 'next/navigation';
import OrderClient, { type T } from '@friends-library/pairql/order';
import { t } from '@friends-library/locale';
import type { Metadata, NextPage } from 'next';
import type { Params } from '@/lib/types';
import PrintButton from './PrintButton';
import { SELLER } from './seller';
import { LANG } from '@/lib/env';

type Path = { uuid: string };

const Page: NextPage<Params<Path>> = async ({ params }) => {
  const client = OrderClient.node(process);
  const result = await client.getOrderInvoice(params.uuid);
  const order = result.unwrapWith404(notFound);

  const itemsSubtotalCents = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceInCents,
    0,
  );

  return (
    <div className="bg-gray-100 print:bg-white py-10 print:py-0 min-h-screen">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { margin: 0.5in; }
              body { background: white !important; }
              nav, footer, .print-hide { display: none !important; }
              body > div > div { padding-top: 0 !important; }
            }
          `,
        }}
      />
      <div className="max-w-3xl mx-auto px-4 print:px-0 print:max-w-full">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h2 className="font-sans text-lg text-gray-700">{t`Commercial Invoice`}</h2>
          <PrintButton />
        </div>
        <article className="bg-white print:bg-white shadow-sm print:shadow-none p-8 print:p-0 font-sans text-sm text-gray-900">
          <header className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">
                {t`Commercial Invoice`}
              </h1>
              <div className="text-xs text-gray-600 mt-1">
                {t`501(c)(3) non-profit organization`}
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-semibold">{t`Order Number`}</div>
              <div className="font-mono text-gray-800">{order.id}</div>
              <div className="font-semibold mt-2">{t`Order Date`}</div>
              <div className="text-gray-800">{formatDate(order.createdAt)}</div>
            </div>
          </header>

          <section className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {t`Seller`}
              </h2>
              <div className="font-semibold">{SELLER.name}</div>
              <div>{SELLER.street}</div>
              <div>{SELLER.cityStateZip}</div>
              <div>{t`United States of America`}</div>
              <div className="mt-2 text-xs text-gray-600">
                <div>
                  {t`Email`}: <span className="text-gray-800">{SELLER.email}</span>
                </div>
                <div>
                  {t`Tax ID`} (EIN):{` `}
                  <span className="text-gray-800">{SELLER.taxId}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {t`Ship To`}
              </h2>
              <div className="font-semibold">{order.address.name}</div>
              <div>{order.address.street}</div>
              {order.address.street2 && <div>{order.address.street2}</div>}
              <div>
                {order.address.city}, {order.address.state} {order.address.zip}
              </div>
              <div>{order.address.country}</div>
              <div className="mt-2 text-xs text-gray-600">
                <div>
                  {t`Email`}: <span className="text-gray-800">{order.email}</span>
                </div>
                {order.address.recipientTaxId && (
                  <div>
                    {t`Tax ID`}:{` `}
                    <span className="text-gray-800">{order.address.recipientTaxId}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900 text-xs uppercase tracking-wider text-gray-700">
                  <th className="py-2 pr-2 font-semibold">{t`Item`}</th>
                  <th className="py-2 px-2 font-semibold whitespace-nowrap">
                    {t`ISBN-13`}
                  </th>
                  <th className="py-2 px-2 font-semibold text-right">{t`Qty`}</th>
                  <th className="py-2 px-2 font-semibold text-right whitespace-nowrap">
                    {t`Unit Price`}
                  </th>
                  <th className="py-2 pl-2 font-semibold text-right">{t`Total`}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 align-top">
                    <td className="py-2 pr-2">
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-gray-600">{item.authorName}</div>
                    </td>
                    <td className="py-2 px-2 font-mono text-xs whitespace-nowrap">
                      {item.isbn ?? `—`}
                    </td>
                    <td className="py-2 px-2 text-right">{item.quantity}</td>
                    <td className="py-2 px-2 text-right whitespace-nowrap">
                      {formatCents(item.unitPriceInCents)}
                    </td>
                    <td className="py-2 pl-2 text-right whitespace-nowrap">
                      {formatCents(item.quantity * item.unitPriceInCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="flex justify-end mb-6">
            <div className="w-64 space-y-1 text-sm">
              <Line label={t`Subtotal`} value={formatCents(itemsSubtotalCents)} />
              <Line label={t`Shipping`} value={formatCents(order.shippingInCents)} />
              {order.taxesInCents > 0 && (
                <Line label={t`Taxes`} value={formatCents(order.taxesInCents)} />
              )}
              {order.feesInCents + order.ccFeeOffsetInCents > 0 && (
                <Line
                  label={t`Handling`}
                  value={formatCents(order.feesInCents + order.ccFeeOffsetInCents)}
                />
              )}
              <div className="border-t border-gray-900 pt-1 mt-1 flex justify-between font-bold">
                <span>{t`Total`}</span>
                <span>{formatCents(order.amountInCents)} USD</span>
              </div>
              <div className="text-xs text-gray-600 pt-1 text-right">
                {t`Currency`}: USD
              </div>
            </div>
          </section>

          <section className="border-t border-gray-300 pt-4 mb-4 grid grid-cols-2 gap-6 text-xs">
            <div>
              <h3 className="uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {t`Payment Status`}
              </h3>
              {order.source === `website` ? (
                <>
                  <div className="font-semibold text-gray-900">{t`Paid`}</div>
                  <div className="text-gray-600 mt-1">
                    {t`Payment Reference`}:{` `}
                    <span className="font-mono">{order.paymentId}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-gray-900">
                    {t`Complimentary copy — no charge to recipient`}
                  </div>
                  <div className="text-gray-600 mt-1">
                    {t`Value shown for customs purposes only.`}
                  </div>
                </>
              )}
            </div>
            <div>
              <h3 className="uppercase tracking-wider text-gray-500 font-semibold mb-1">
                {t`Order Status`}
              </h3>
              <div className="font-semibold text-gray-900">
                {orderStatusLabel(order.printJobStatus)}
              </div>
            </div>
          </section>

          <section className="border-t border-gray-300 pt-4 text-xs text-gray-700 space-y-2">
            <div>
              <span className="font-semibold">{t`Country of Origin`}:</span>
              {` `}
              {t`United States of America`}
            </div>
            <div>
              <span className="font-semibold">{t`HS Code`}:</span> 4901.99{` `}
              <span className="text-gray-500">— {t`Printed books`}</span>
            </div>
            <p className="pt-2">
              {t`Goods are printed books for personal, non-commercial use. Not for resale.`}
            </p>
            <p>
              {t`Friends Library Publishing is a U.S. registered 501(c)(3) non-profit organization. Books are sold at production cost and contain no commercial markup.`}
            </p>
            <p className="pt-2 text-gray-500">
              {t`This is a system-generated document. Please contact us with any questions at ${SELLER.email}.`}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default Page;

export const dynamic = `force-dynamic`;

export function generateMetadata({ params }: Params<Path>): Metadata {
  const shortId = params.uuid.split(`-`)[0];
  return {
    title: `${t`Commercial Invoice`} — ${shortId}`,
    robots: { index: false, follow: false },
  };
}

const Line: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-700">{label}</span>
    <span>{value}</span>
  </div>
);

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(LANG === `es` ? `es-ES` : `en-US`, {
    year: `numeric`,
    month: `long`,
    day: `numeric`,
  });
}

function orderStatusLabel(status: T.GetOrderInvoice.Output[`printJobStatus`]): string {
  switch (status) {
    case `shipped`:
      return t`Order Shipped`;
    case `presubmit`:
    case `pending`:
    case `accepted`:
      return t`Awaiting Fulfillment`;
    default:
      return t`Order Confirmed`;
  }
}
