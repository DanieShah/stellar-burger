import { expect, it, describe } from '@jest/globals';
import {
  ingredientsReducers,
  addIngredient,
  TIngredientsState,
  filterIngredientsByType,
  createConstructorObject,
  handleMoveDownIngredient,
  handleMoveUpIngredient,
  handleCloseIngredient,
  findIngredient,
  submitOrder,
  getIngredientsApiThunk
} from './api-ingredients-slice';
import { TConstructorIngredient } from '@utils-types';
import { act } from '@testing-library/react';
import { error } from 'console';
import { initialState } from './api-ingredients-slice';

describe('тесты редюсеров [api-ingredients-slice]', function (): void {

  const ingredient1: TConstructorIngredient = {
    _id: '12345',
    name: 'test_1',
    type: 'bun',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 213,
    price: 213,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '54321'
  };

  const ingredient2: TConstructorIngredient = {
    _id: '23456',
    name: 'test_2',
    type: 'main',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 213,
    price: 213,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '65432'
  };

  const ingredient3: TConstructorIngredient = {
    _id: '34567',
    name: 'test_2',
    type: 'main',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 213,
    price: 213,
    image: 'string',
    image_large: 'string',
    image_mobile: 'string',
    id: '76543'
  };

  it('добавляем булки в конструктор, редюсер [addIngredient]', () => {
    const newState: TIngredientsState = ingredientsReducers(
      initialState,
      addIngredient({
        _id: '3',
        name: 'test_3',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      })
    );

    const { constructor }: TIngredientsState = newState;

    const needState = {
      ...constructor,
      bun: {
        ...constructor.bun,
        id: '123456'
      }
    };

    expect(needState).toEqual({
      bun: {
        _id: '3',
        name: 'test_3',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string',
        id: '123456'
      },
      ingredients: []
    });
  });

  it('Фильтруем ингридиенты, редюсер [filterIngredientsByType]', () => {
    const actualState = {
      ...initialState,
      ingredients: [{
        _id: '1',
        name: 'test_1',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      },
      {
        _id: '2',
        name: 'test_2',
        type: 'main',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      },
      {
        _id: '3',
        name: 'test_3',
        type: 'sauce',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      }]
    }

    const newState: TIngredientsState = ingredientsReducers(
      actualState,
      filterIngredientsByType()
    );

    const { bun, main, sauce } = newState.filterIngredient;

    expect(bun).toEqual([
      {
        _id: '1',
        name: 'test_1',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      }
    ]);

    expect(main).toEqual([
      {
        _id: '2',
        name: 'test_2',
        type: 'main',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      }
    ]);

    expect(sauce).toEqual([
      {
        _id: '3',
        name: 'test_3',
        type: 'sauce',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      }
    ]);
  });

  it('Создание массива с _id булок, редюсер [createConstructorObject]', () => {
    const newState = {
      ...initialState,
      filterIngredient: {
        ...initialState.filterIngredient,
        bun: [
          {
            _id: '1',
            name: 'test_1',
            type: 'bun',
            proteins: 123,
            fat: 123,
            carbohydrates: 123,
            calories: 213,
            price: 213,
            image: 'string',
            image_large: 'string',
            image_mobile: 'string'
          }
        ]
      }
    };

    const constructorState = ingredientsReducers(
      newState,
      createConstructorObject()
    );
    const { construcotBunArr } = constructorState;

    expect(construcotBunArr).toEqual(['1']);
  });

  it('Изменение порядка ингридиентов нажатием кнопки вниз, редюсер [handleMoveDownIngredient]', () => {
    const newState = {
      ...initialState,
      constructor: {
        ...initialState.constructor,
        ingredients: [ingredient1, ingredient2, ingredient3]
      }
    };

    const changeState = ingredientsReducers(
      newState,
      handleMoveDownIngredient(ingredient2)
    );

    const { ingredients } = changeState.constructor;

    expect(ingredients).toEqual([ingredient1, ingredient3, ingredient2]);
  });

  it('Изменение порядка ингридиентов нажатием кнопки вверх, редюсер [handleMoveUpIngredient]', () => {
    const newState = {
      ...initialState,
      constructor: {
        ...initialState.constructor,
        ingredients: [ingredient1, ingredient2, ingredient3]
      }
    };

    const changeState = ingredientsReducers(
      newState,
      handleMoveUpIngredient(ingredient2)
    );

    const { ingredients } = changeState.constructor;

    expect(ingredients).toEqual([ingredient2, ingredient1, ingredient3]);
  });

  it('Удаление иноидиента из конструктора, редюсер [handleCloseIngredient]', () => {
    const newState = {
      ...initialState,
      constructor: {
        ...initialState.constructor,
        ingredients: [ingredient1, ingredient2, ingredient3]
      }
    };

    const changeState = ingredientsReducers(
      newState,
      handleCloseIngredient(ingredient2)
    );

    const { ingredients } = changeState.constructor;

    expect(ingredients).toEqual([ingredient1, ingredient3]);
  });

  it('Найти игридиент по [_id], рудюсер [findIngredient]', () => {
    const actualState = {
      ...initialState,
      ingredients: [{
        _id: '1',
        name: 'test_1',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      },
      {
        _id: '1',
        name: 'test_1',
        type: 'bun',
        proteins: 123,
        fat: 123,
        carbohydrates: 123,
        calories: 213,
        price: 213,
        image: 'string',
        image_large: 'string',
        image_mobile: 'string'
      }]
    }
    const newState = ingredientsReducers(actualState, findIngredient('1'));
    const { ingredient } = newState;

    expect(ingredient).toEqual({
      _id: '1',
      name: 'test_1',
      type: 'bun',
      proteins: 123,
      fat: 123,
      carbohydrates: 123,
      calories: 213,
      price: 213,
      image: 'string',
      image_large: 'string',
      image_mobile: 'string'
    });
  });

  it('Отчистка контруктора после окончания заказа, редюсер [submitOrder]', () => {
    const newState = {
      ...initialState,
      constructor: {
        ...initialState.constructor,
        bun: ingredient1,
        ingredients: [ingredient2, ingredient3]
      }
    };

    const { constructor, construcotBunArr, constructorIngredientArr } =
      ingredientsReducers(newState, submitOrder());

    expect(constructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(construcotBunArr).toEqual([]);
    expect(constructorIngredientArr).toEqual([]);
  });

  describe('тесты асинхронных экшенов', () => {
    it('редюсер [getIngredientsApiThunk.pending]', () => {
      const actualState = ingredientsReducers(
        initialState,
        getIngredientsApiThunk.pending('')
      );

      expect(actualState).toEqual({
        ...initialState,
        isLoading: true
      });
    });

    it('редюсер [getIngredientsApiThunk.rejected]', () => {
      const actualState = ingredientsReducers(
        initialState,
        getIngredientsApiThunk.rejected(new Error('TestError'), '')
      );

      expect(actualState).toEqual({
        ...initialState,
        isLoading: false,
        error: 'TestError'
      });
    });

    it('редюсер [getIngredientsApiThunk.fulfilled]', () => {
      const actualState = ingredientsReducers(
        initialState,
        getIngredientsApiThunk.fulfilled(
          [
            {
              _id: '1',
              name: 'test_1',
              type: 'bun',
              proteins: 123,
              fat: 123,
              carbohydrates: 123,
              calories: 213,
              price: 213,
              image: 'string',
              image_large: 'string',
              image_mobile: 'string'
            }
          ],
          ''
        )
      );

      expect(actualState).toEqual({
        ...initialState,
        isLoading: false,
        ingredients: [
          {
            _id: '1',
            name: 'test_1',
            type: 'bun',
            proteins: 123,
            fat: 123,
            carbohydrates: 123,
            calories: 213,
            price: 213,
            image: 'string',
            image_large: 'string',
            image_mobile: 'string'
          }
        ]
      });
    });
  });
});
