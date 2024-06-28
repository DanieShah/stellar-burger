import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  getBunIdArr,
  getConstructorSelector,
  getIngredientIdArr,
  submitOrder
} from '../../slices/api-ingredients-slice';
import {
  getFinishOrder,
  getOrderModalData,
  getOrderRequest,
  getOrderSelector,
  orderBurgerApiThunk
} from '../../slices/api-order-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorSelector);
  const bunIdArr = useSelector(getBunIdArr);
  const ingredientsIdArr = useSelector(getIngredientIdArr);

  const navigate = useNavigate();

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderModalData);

  const onOrderClick = () => {
    if (localStorage.getItem('accessToken')) {
      const arr = bunIdArr.concat(ingredientsIdArr);
      dispatch(orderBurgerApiThunk(arr)).then(() => {
        dispatch(submitOrder());
      });
    } else {
      navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {
    if (orderModalData) {
      dispatch(getFinishOrder());
    }
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
