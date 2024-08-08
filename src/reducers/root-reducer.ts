import { combineReducers } from 'redux';
import {
  ingredientsReducers,
  ingredientsSlice
} from '../slices/api-ingredients-slice';
import { orderReducer, orderSlice } from '../slices/api-order-slice';
import { feedReducer, feedSlice } from '../slices/api-feed-slice';
import { userReducer, userSlice } from '../slices/api-user-silce';

export const rootReducer = combineReducers({
  [ingredientsSlice.reducerPath]: ingredientsReducers,
  [orderSlice.reducerPath]: orderReducer,
  [feedSlice.reducerPath]: feedReducer,
  [userSlice.reducerPath]: userReducer
});
