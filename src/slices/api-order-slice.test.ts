import { expect, it, describe } from '@jest/globals';
import {
  TOrderState,
  getFinishOrder,
  getOrderApiThunk,
  getOrderByNumberApiThunk,
  orderBurgerApiThunk,
  orderReducer
} from './api-order-slice';
import { TOrder } from '@utils-types';
import { error } from 'console';
import { TOrderResponse } from '../utils/burger-api';

describe('тесты редюсеров [api-order-slice]', () => {
  const order1: TOrder = {
    _id: '12345',
    status: 'status',
    name: 'test_1',
    createdAt: 'data',
    updatedAt: 'data',
    number: 12345,
    ingredients: ['1', '2', '3']
  };

  const order2: TOrder = {
    _id: '23456',
    status: 'status',
    name: 'test_2',
    createdAt: 'data',
    updatedAt: 'data',
    number: 23456,
    ingredients: ['1', '2', '3']
  };

  const initialState: TOrderState = {
    order: order1,
    orders: [order1, order2],
    isLoading: true,
    error: undefined,
    orderRequest: false,
    orderModalData: order1
  };

  it('окончание заказа, редюсер [getFinishOrder]', () => {
    const { orderModalData } = orderReducer(initialState, getFinishOrder());

    expect(orderModalData).toEqual(null);
  });

  describe('тесты асинхронных экшенов', () => {
    it('редюсер [getOrderByNumberApiThunk.pending]', () => {
      const actualState = orderReducer(
        initialState,
        getOrderByNumberApiThunk.pending('', 0)
      );

      expect(actualState).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('редюсер [getOrderByNumberApiThunk.rejected]', () => {
      const actualState = orderReducer(
        initialState,
        getOrderByNumberApiThunk.rejected(new Error('TestError'), '', 0)
      );

      expect(actualState).toEqual({
        ...initialState,
        error: 'TestError',
        isLoading: false
      });
    });

    it('редюсер [getOrderByNumberApiThunk.fulfilled]', () => {
      const data: TOrderResponse = {
        success: true,
        orders: [order1]
      };

      const actualState = orderReducer(
        initialState,
        getOrderByNumberApiThunk.fulfilled(data, '', 0)
      );

      expect(actualState).toEqual({
        ...initialState,
        isLoading: false,
        order: order1
      });
    });

    it('редюсер [orderBurgerApiThunk.pending]', () => {
      const actualState = orderReducer(
        initialState,
        orderBurgerApiThunk.pending('', [''])
      );

      expect(actualState).toEqual({
        ...initialState,
        orderRequest: false,
        orderModalData: initialState.order
      });
    });

    it('редюсер [orderBurgerApiThunk.fulfilled]', () => {
      const actualState = orderReducer(
        initialState,
        orderBurgerApiThunk.fulfilled(
          {
            success: true,
            name: 'testname',
            order: order1
          },
          '',
          ['']
        )
      );

      expect(actualState).toEqual({
        ...initialState,
        orderModalData: order1
      });
    });

    it('редюсер [getOrderApiThunk.fulfilled]', () => {
      const actualState = orderReducer(
        initialState,
        getOrderApiThunk.fulfilled([order1], '')
      );

      expect(actualState).toEqual({
        ...initialState,
        orders: [order1]
      });
    });
  });
});
