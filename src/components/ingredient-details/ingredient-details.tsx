import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  findIngredient,
  getIngredientsSelector
} from '../../slices/api-ingredients-slice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { ingredient } = useSelector(getIngredientsSelector);
  const dispatch = useDispatch();
  const ingredientData = ingredient;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    dispatch(findIngredient(id as string));
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
