import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrderApiThunk,
  getOrdersSelector
} from '../../slices/api-order-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(getOrdersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderApiThunk());
  });

  return <ProfileOrdersUI orders={orders} />;
};
