import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export const getIngredientsApiThunk = createAsyncThunk(
  'ingredients/getAllIngredients',
  async () => getIngredientsApi()
);

type TIngredientsState = {
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
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[] | [] | any;
  };
  construcotBunArr: string[];
  constructorIngredientArr: string[];
};

const initialState: TIngredientsState = {
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
    addIngredientToConstructor: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = state.ingredients.find(
        (el) => el._id === action.payload._id
      );

      if (
        ingredient?.type === 'bun' &&
        state.constructor.bun?._id !== action.payload._id
      ) {
        state.constructor.bun = action.payload;
        if (!state.construcotBunArr.find((el) => el === action.payload._id)) {
          state.construcotBunArr.push(action.payload._id);
          state.construcotBunArr = state.construcotBunArr.filter(
            (el) => el === action.payload._id
          );
        }
      } else if (
        !state.constructor.ingredients.find(
          (el: TConstructorIngredient) => el.id === ingredient?._id
        ) &&
        ingredient?.type !== 'bun'
      ) {
        state.constructorIngredientArr.push(action.payload._id);
        state.constructor.ingredients.push({
          ...ingredient,
          id: action.payload._id
        });
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
      state.constructorIngredientArr = state.constructorIngredientArr.filter(
        (el) => el !== action.payload._id
      );
    },
    findIngredient: (state, action: PayloadAction<string>) => {
      state.ingredient = state.ingredients.find(
        (el: TIngredient) => el._id === action.payload
      );
    },
    submitOrder: (state) => {
      state.constructor.bun = state.constructor.bun =
        state.filterIngredient.bun[0];
      state.constructor.ingredients = [];
      state.construcotBunArr = [state.filterIngredient.bun[0]._id];
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
  addIngredientToConstructor,
  handleMoveDownIngredient,
  handleMoveUpIngredient,
  handleCloseIngredient,
  findIngredient,
  submitOrder
} = ingredientsSlice.actions;
