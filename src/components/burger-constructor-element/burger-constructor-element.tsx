import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useSelector, useDispatch } from '../../services/store';
import {
  handleCloseIngredient,
  handleMoveDownIngredient,
  handleMoveUpIngredient
} from '../../slices/api-ingredients-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, ...rest }) => {
    const dispatch = useDispatch();
    const handleMoveDown = () => {
      dispatch(handleMoveDownIngredient(ingredient));
    };

    const handleMoveUp = () => {
      dispatch(handleMoveUpIngredient(ingredient));
    };

    const handleClose = () => {
      dispatch(handleCloseIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
        {...rest}
      />
    );
  }
);
