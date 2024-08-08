import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

import { getFeedsApi } from '@api';

export const getFeedsApiThunk = createAsyncThunk('feed/getFeedsApi', async () =>
  getFeedsApi()
);

type TFeedState = {
  orders: TOrder[] | [];
  total: number | null;
  totalToday: number | null;
  isLoading: boolean;
  error: string | undefined;
};

const initialState: TFeedState = {
  orders: [],
  total: null,
  totalToday: null,
  isLoading: true,
  error: undefined
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (state) => state.orders,
    totalSelector: (state) => state.total,
    totalTodaySelector: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsApiThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getFeedsApiThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getFeedsApiThunk.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  }
});

export const feedReducer = feedSlice.reducer;
export const { getFeedSelector, totalSelector, totalTodaySelector } =
  feedSlice.selectors;
export const {} = feedSlice.actions;
