import { describe, it, beforeEach, expect, vi } from 'vitest';
import { type T } from '@friends-library/pairql/order';
import type CheckoutApi from '../CheckoutApi';
import CheckoutService from '../CheckoutService';
import { cartPlusData } from '../../models/__tests__/fixtures';

vi.useFakeTimers();

describe(`CheckoutService()`, () => {
  let service: CheckoutService;
  const apiGetExploratoryMetadata = vi.fn();
  const apiCreateOrder = vi.fn();

  beforeEach(() => {
    service = new CheckoutService(cartPlusData(), {
      getExploratoryMetadata: apiGetExploratoryMetadata,
      createOrder: apiCreateOrder,
    } as unknown as CheckoutApi);
    service.orderId = `order-id`;
  });

  describe(`.getExploratoryMetadata()`, () => {
    function successResponse(
      input: Partial<{
        shippingLevel: T.ShippingLevel;
        shippingInCents: number;
        taxesInCents: number;
        feesInCents: number;
        creditCardFeeOffsetInCents: number;
      }> = {},
    ): ReturnType<InstanceType<typeof CheckoutApi>[`getExploratoryMetadata`]> {
      return Promise.resolve({
        status: `success`,
        metadata: {
          shippingLevel: input.shippingLevel ?? `mail`,
          shipping: input.shippingInCents ?? 399,
          taxes: input.taxesInCents ?? 0,
          fees: input.feesInCents ?? 0,
          creditCardFeeOffset: input.creditCardFeeOffsetInCents ?? 42,
        },
      });
    }

    beforeEach(() => {
      apiGetExploratoryMetadata.mockClear();
    });

    it(`passes correct payload to api`, async () => {
      apiGetExploratoryMetadata.mockReturnValue(successResponse());

      await service.getExploratoryMetadata();

      expect(apiGetExploratoryMetadata).toHaveBeenCalledWith(
        service.cart.items.map((i) => ({
          volumes: i.numPages,
          printSize: i.printSize,
          quantity: i.quantity,
        })),
        {
          city: service.cart.address!.city,
          country: service.cart.address!.country,
          name: service.cart.address!.name,
          state: service.cart.address!.state,
          street: service.cart.address!.street,
          street2: service.cart.address!.street2,
          zip: service.cart.address!.zip,
          email: service.cart.email,
        },
      );
    });

    it(`should return null error and set internal state if success`, async () => {
      apiGetExploratoryMetadata.mockReturnValue(
        successResponse({ shippingInCents: 399, creditCardFeeOffsetInCents: 42 }),
      );
      const err = await service.getExploratoryMetadata();

      expect(err).toBeUndefined();
      expect(service.shippingLevel).toBe(`mail`);
      expect(service.metadata).toEqual({
        shipping: 399,
        taxes: 0,
        ccFeeOffset: 42,
        fees: 0,
      });
    });

    it(`should not send data about item with quantity = 0`, async () => {
      apiGetExploratoryMetadata.mockResolvedValue(successResponse());
      service.cart.items[0]!.quantity = 0;

      await service.getExploratoryMetadata();

      const payloadItems = apiGetExploratoryMetadata.mock.calls[0]![0];
      expect(payloadItems[0].quantity).not.toBe(0);
      expect(payloadItems).toHaveLength(1);
    });

    it(`returns error if error`, async () => {
      apiGetExploratoryMetadata.mockResolvedValue({ status: `shipping_not_possible` });

      const err = await service.getExploratoryMetadata();

      expect(err).toBe(`shipping_not_possible`);
    });
  });

  describe(`createOrder()`, () => {
    beforeEach(() => apiCreateOrder.mockClear());

    it(`passes correct payload to api`, async () => {
      service.shippingLevel = `expedited`;
      service.paymentIntentId = `pi_123abc`;
      service.token = `rad-token`;
      service.metadata = { fees: 0, shipping: 1, taxes: 0, ccFeeOffset: 1 };
      apiCreateOrder.mockResolvedValue(true);

      await service.createOrder();

      expect(apiCreateOrder).toHaveBeenCalledWith(
        {
          lang: `en`,
          amount: service.cart.subTotal() + 2, // 2 = sum of all fees
          paymentId: service.paymentIntentId,
          shippingLevel: service.shippingLevel,
          id: service.orderId,
          shipping: 1,
          taxes: 0,
          fees: 0,
          ccFeeOffset: 1,
          source: `website`,
          email: service.cart.email,
          addressName: service.cart.address!.name,
          addressStreet: service.cart.address!.street,
          addressStreet2: service.cart.address!.street2,
          addressCity: service.cart.address!.city,
          addressState: service.cart.address!.state,
          addressZip: service.cart.address!.zip,
          addressCountry: service.cart.address!.country,
        },
        service.cart.items.map((i) => ({
          editionId: i.editionId,
          quantity: i.quantity,
          unitPrice: i.price(),
        })),
        `rad-token`,
      );
    });

    it(`should not send item with quantity = 0`, async () => {
      service.cart.items[0]!.quantity = 0;
      apiCreateOrder.mockResolvedValue(true);
      await service.createOrder();
      const payloadItems = apiCreateOrder.mock.calls[0]![1];
      expect(payloadItems[0].quantity).not.toBe(0);
      expect(payloadItems).toHaveLength(1);
    });

    it(`should return null error if success`, async () => {
      apiCreateOrder.mockResolvedValue(true);
      const err = await service.createOrder();
      expect(err).toBeUndefined();
    });

    it(`returns error if error`, async () => {
      apiCreateOrder.mockResolvedValue(false);
      const err = await service.createOrder();
      expect(err).toBe(`error creating order`);
    });
  });
});
