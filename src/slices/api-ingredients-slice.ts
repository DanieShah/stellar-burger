import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export const getIngredientsApiThunk = createAsyncThunk(
  'ingredients/getAllIngredients',
  async () => getIngredientsApi()
);

export type TIngredientsState = {
  ingredients: TIngredient[] | [];
  ingredient: TIngredient | undefined;
  isLoading: boolean;
  error: string | undefined;
  filterIngredient: {
    bun: TIngredient[] | [];
    sauce: TIngredient[] | [];
    main: TIngredient[] | [];
  };
  constructor: {
    bun: TIngredient | TConstructorIngredient | null;
    ingredients: TConstructorIngredient[] | [] | any;
  };
  construcotBunArr: string[];
  constructorIngredientArr: string[];
};

export const initialState: TIngredientsState = {
  ingredients: [],
  ingredient: undefined,
  isLoading: false,
  error: undefined,
  filterIngredient: {
    bun: [],
    sauce: [],
    main: []
  },
  constructor: {
    bun: null,
    ingredients: []
  },
  construcotBunArr: [],
  constructorIngredientArr: []
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    filterIngredientsByType: (state) => {
      state.filterIngredient.bun = state.ingredients.filter(
        (el) => el.type === 'bun'
      );
      state.filterIngredient.sauce = state.ingredients.filter(
        (el) => el.type === 'sauce'
      );
      state.filterIngredient.main = state.ingredients.filter(
        (el) => el.type === 'main'
      );
    },
    createConstructorObject: (state) => {
      state.constructor.bun = state.filterIngredient.bun[0];
      state.construcotBunArr.push(state.filterIngredient.bun[0]._id);
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (
          action.payload.type === 'bun' &&
          state.constructor.bun?._id !== action.payload._id
        ) {
          state.constructor.bun = action.payload;
          if (!state.construcotBunArr.find((el) => el === action.payload._id)) {
            state.construcotBunArr.push(action.payload._id);
            state.construcotBunArr = state.construcotBunArr.filter(
              (el) => el === action.payload._id
            );
          }
        } else {
          state.constructor.ingredients.push(action.payload);
          state.constructorIngredientArr.push(action.payload._id);
        }
      },
      prepare: (ingredient: TIngredient): any => {
        const obj = { payload: { ...ingredient, id: uuidv4() } };
        return obj;
      }
    },
    handleMoveDownIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const first: TConstructorIngredient =
        state.constructor.ingredients[
          current(state).constructor.ingredients.indexOf(action.payload)
        ];
      const second: TConstructorIngredient =
        state.constructor.ingredients[
          current(state).constructor.ingredients.indexOf(action.payload) + 1
        ];
      state.constructor.ingredients[
        current(state).constructor.ingredients.indexOf(action.payload) + 1
      ] = first;
      state.constructor.ingredients[
        current(state).constructor.ingredients.indexOf(action.payload)
      ] = second;
    },
    handleMoveUpIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const first: TConstructorIngredient =
        state.constructor.ingredients[
          current(state.constructor.ingredients).indexOf(action.payload)
        ];
      const second: TConstructorIngredient =
        state.constructor.ingredients[
          current(state.constructor.ingredients).indexOf(action.payload) - 1
        ];
      state.constructor.ingredients[
        current(state.constructor.ingredients).indexOf(action.payload) - 1
      ] = first;
      state.constructor.ingredients[
        current(state.constructor.ingredients).indexOf(action.payload) + 1
      ] = second;
    },
    handleCloseIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructor.ingredients = current(
        state
      ).constructor.ingredients.filter(
        (el: TConstructorIngredient) => el !== action.payload
      );
      state.constructorIngredientArr.splice(
        state.constructorIngredientArr.indexOf(action.payload._id),
        1
      );
    },
    findIngredient: (state, action: PayloadAction<string>) => {
      state.ingredient = state.ingredients.find(
        (el: TIngredient) => el._id === action.payload
      );
    },
    submitOrder: (state) => {
      state.constructor.bun = null;
      state.constructor.ingredients = [];
      state.construcotBunArr = [];
      state.constructorIngredientArr = [];
    }
  },
  selectors: {
    getIngredientsSelector: (state) => state,
    getConstructorSelector: (state) => state.constructor,
    getIngredSelector: (state) => state.ingredients,
    getBunIdArr: (state) => state.construcotBunArr,
    getIngredientIdArr: (state) => state.constructorIngredientArr
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsApiThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getIngredientsApiThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredientsApiThunk.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.isLoading = false;
      });
  }
});

export const {
  getIngredientsSelector,
  getConstructorSelector,
  getIngredSelector,
  getBunIdArr,
  getIngredientIdArr
} = ingredientsSlice.selectors;
export const ingredientsReducers = ingredientsSlice.reducer;
export const {
  filterIngredientsByType,
  createConstructorObject,
  handleMoveDownIngredient,
  handleMoveUpIngredient,
  handleCloseIngredient,
  findIngredient,
  submitOrder,
  addIngredient
} = ingredientsSlice.actions;
