import { expect, it, describe } from '@jest/globals';
import {
  TFeedState,
  feedReducer,
  feedSlice,
  getFeedsApiThunk
} from './api-feed-slice';
import { TFeedsResponse } from '@api';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { json } from 'stream/consumers';
import { error } from 'console';
import { store } from '../services/store';

describe('тесты редюсеров [api-feed-slice]', () => {
  describe('тесты асинхронных экшенов', () => {
    const initialState: TFeedState = {
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: undefined
    };

    const data: TFeedsResponse = {
      orders: [
        {
          _id: '12345',
          status: 'status',
          name: 'test_1',
          createdAt: 'data',
          updatedAt: 'data',
          number: 12345,
          ingredients: ['1', '2', '3']
        }
      ],
      total: 123,
      totalToday: 123,
      success: true
    };

    it('редюсер [getFeedsApiThunk.pending]', async () => {
      const actualState = feedReducer(
        {
          ...initialState
        },
        getFeedsApiThunk.pending('')
      );
      expect(actualState).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true,
        error: undefined
      });
    });

    it('редюсер [getFeedsApiThunk.rejected]', async () => {
      const actualState = feedReducer(
        {
          ...initialState
        },
        getFeedsApiThunk.rejected(new Error('Test Error'), '')
      );

      expect(actualState).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: 'Test Error'
      });
    });

    it('редюсер [getFeedsApiThunk.fulfilled]', async () => {
      const actualState = feedReducer(
        {
          ...initialState
        },
        getFeedsApiThunk.fulfilled(data, '')
      );

      expect(actualState).toEqual({
        error: undefined,
        isLoading: false,
        orders: [
          {
            _id: '12345',
            createdAt: 'data',
            ingredients: ['1', '2', '3'],
            name: 'test_1',
            number: 12345,
            status: 'status',
            updatedAt: 'data'
          }
        ],
        total: 123,
        totalToday: 123
      });
    });
  });
});
