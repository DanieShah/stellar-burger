import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../utils/burger-api';

export const getOrderByNumberApiThunk = createAsyncThunk(
  'order/getOrderApiByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const getOrderApiThunk = createAsyncThunk(
  'order/getOrderApi',
  async () => getOrdersApi()
);

export const orderBurgerApiThunk = createAsyncThunk(
  'order/orderBurgerApiThunk',
  async (data: string[]) => orderBurgerApi(data)
);

export type TOrderState = {
  order: TOrder | null;
  orders: TOrder[] | [];
  isLoading: boolean;
  error: string | undefined;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  order: null,
  orders: [],
  isLoading: true,
  error: undefined,
  orderRequest: false,
  orderModalData: null
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    getFinishOrder: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrderSelector: (state) => state.order,
    getOrdersSelector: (state) => state.orders,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumberApiThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getOrderByNumberApiThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumberApiThunk.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isLoading = false;
      })
      .addCase(orderBurgerApiThunk.pending, (state, action) => {
        state.orderRequest = true;
        state.orderModalData = state.order;
        state.orderRequest = false;
      })
      .addCase(orderBurgerApiThunk.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrderApiThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const {
  getOrderSelector,
  getOrdersSelector,
  getOrderRequest,
  getOrderModalData
} = orderSlice.selectors;
export const orderReducer = orderSlice.reducer;
export const { getFinishOrder } = orderSlice.actions;
