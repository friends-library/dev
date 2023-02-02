import React from 'react';
import cx from 'classnames';
import { useParams } from 'react-router-dom';
import { gql } from '../../client';
import { OrderSource } from '../../graphql/globalTypes';
import { ViewOrder as ViewOrderQuery } from '../../graphql/ViewOrder';
import { money } from '../../lib/money';
import { useQueryResult } from '../../lib/query';

interface Props {
  order: ViewOrderQuery['order'];
}

export const ViewOrder: React.FC<Props> = ({ order }) => {
  return (
    <div>
      <div className="md:grid grid-cols-2">
        <div className="space-y-4">
          <div className="mt-4 md:mt-0">
            <h1 className="label flex">
              Created:{` `}
              <span className="subtle-text text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()} at{` `}
                {new Date(order.createdAt).toLocaleTimeString().toLowerCase()}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="label">Personal Info:</h1>
            <ul className="subtle-text pl-3 text-gray-500">
              <li>{order.address.name}</li>
              <li>
                <a
                  className="border-b border-dotted text-flblue"
                  href={`mailto:${order.email}`}
                >
                  {order.email}
                </a>
              </li>
              <li>{order.address.street}</li>
              {order.address.street2 && <li>{order.address.street2}</li>}
              <li>
                {order.address.city}, {order.address.state}, {order.address.zip}
              </li>
              <li>{order.address.country}</li>
            </ul>
          </div>
          {order.source !== OrderSource.internal ? (
            <div>
              <h1 className="label">
                Stripe:{` `}
                <a
                  className="border-b border-dotted text-flblue"
                  href={`https://dashboard.stripe.com/payments/${order.paymentId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  transaction details
                </a>
              </h1>
            </div>
          ) : (
            <div className="inline-block mt-6 text-[10px] px-2 py-px bg-flgreen/75 text-white antialiased font-light uppercase rounded-lg">
              Complimentary
            </div>
          )}
        </div>
        <div className="space-y-4 mt-4 md:mt-0">
          <div>
            <div className="label">Lulu Print Job:</div>
            <ul className="subtle-text pl-3 mt-1 text-gray-500">
              <ListItem label="Status:">{order.printJobStatus}</ListItem>
              <ListItem label="Print Job:">
                {order.printJobId ? (
                  <a
                    className="border-b border-dotted text-flblue"
                    target="_blank"
                    href={`https://developers.lulu.com/print-jobs/detail/${order.printJobId}`}
                    rel="noreferrer"
                  >
                    {order.printJobId}
                  </a>
                ) : (
                  <em>no print job id</em>
                )}
              </ListItem>
            </ul>
          </div>
          <div className="">
            <div className="label">Price:</div>
            <ul className="subtle-text pl-3 mt-1 text-gray-500">
              <ListItem label="Subtotal:">
                {money(
                  order.items.reduce(
                    (acc, item) => acc + item.unitPriceInCents * item.quantity,
                    0,
                  ),
                )}
              </ListItem>
              <ListItem label="Shipping:">{money(order.shippingInCents)}</ListItem>
              <ListItem label="Taxes:">{money(order.taxesInCents)} </ListItem>
              <ListItem label="Other fees:">{money(order.feesInCents)} </ListItem>
              <ListItem label="CC Fee Offset:">
                {money(order.ccFeeOffsetInCents)}
              </ListItem>
              <ListItem label="Total:">
                <b>{money(order.amountInCents)}</b>
              </ListItem>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h1 className="label">Items: ({order.items.length})</h1>
        <div
          className={cx(
            `space-y-3 md:space-y-0 mt-2`,
            order.items.length > 1 && `md:grid grid-cols-2 gap-4`,
          )}
        >
          {order.items.map((item) => (
            <div className="bg-[#efefef] rounded-lg p-3 pr-6 flex" key={item.id}>
              <img
                alt={item.edition.document.title}
                height={item.edition.images.threeD.w250.height}
                width={item.edition.images.threeD.w250.width}
                src={item.edition.images.threeD.w250.url}
                className="w-24 md:w-32"
              />
              <div className="pt-1.5 space-y-1">
                <h1 className="subtle-text">{item.edition.document.title}</h1>
                <h2 className="subtle-text italic serif text-flprimary">
                  {item.edition.document.friend.name}
                </h2>
                <div className="pt-1.5 flex">
                  <span className="label pr-1.5">Edition:</span>
                  <div className="subtle-text">{item.edition.type}</div>
                </div>
                <div className="flex">
                  <span className="label pr-1.5">Quantity:</span>
                  <div className="subtle-text">{item.quantity}</div>
                </div>
                <div className="flex">
                  <span className="label pr-1.5">Price:</span>
                  <div className="subtle-text">{money(item.unitPriceInCents)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ViewOrderContainer: React.FC = () => {
  const { id = `` } = useParams<{ id: UUID }>();
  const query = useQueryResult<ViewOrderQuery>(QUERY_ORDER, {
    variables: { id },
  });
  if (!query.isResolved) {
    return query.unresolvedElement;
  }
  return <ViewOrder order={query.data.order} />;
};

export default ViewOrderContainer;

const QUERY_ORDER = gql`
  query ViewOrder($id: UUID!) {
    order: getOrder(id: $id) {
      id
      printJobStatus
      printJobId
      amountInCents
      shippingInCents
      taxesInCents
      ccFeeOffsetInCents
      feesInCents
      paymentId
      email
      address {
        name
        street
        street2
        city
        state
        zip
        country
      }
      lang
      source
      createdAt
      items {
        id
        quantity
        unitPriceInCents
        edition {
          type
          document {
            title: trimmedUtf8ShortTitle
            friend {
              name
            }
          }
          images {
            threeD {
              w250 {
                width
                height
                url
              }
            }
          }
        }
      }
    }
  }
`;

const ListItem: React.FC<{ label: string }> = ({ label, children }) => {
  return (
    <li className="flex space-x-2">
      <span className="label">{label}</span>
      <span className="subtle-text">{children}</span>
    </li>
  );
};
