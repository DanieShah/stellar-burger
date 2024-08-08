import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current
} from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

export const registerUserApiThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    localStorage.setItem('accessToken', res.accessToken);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const loginUserApiThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('accessToken', res.accessToken);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutApiThunk = createAsyncThunk('user/logout', async () =>
  logoutApi().then(() => {
    localStorage.removeItem('accessToken');
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);

export const updateUserApiThunk = createAsyncThunk(
  'user/updateUserApi',
  async (data: TRegisterData) => updateUserApi(data)
);

export const checkUserAuthThunk = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (localStorage.getItem('accessToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .catch((res) => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => {
          dispatch(setAuthChecked(true));
        });
    } else {
      dispatch(setAuthChecked(true));
    }
  }
);

type TUserState = {
  user: TUser | null;
  isAuthCheked: boolean;
};

const initialState: TUserState = {
  user: null,
  isAuthCheked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthCheked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getAuthChecked: (state) => state.isAuthCheked
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserApiThunk.pending, (state) => {})
      .addCase(registerUserApiThunk.rejected, (state, action) => {})
      .addCase(registerUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginUserApiThunk.pending, (state) => {})
      .addCase(loginUserApiThunk.rejected, (state, action) => {})
      .addCase(loginUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutApiThunk.fulfilled, (state, action) => {
        state.user = null;
      })
      .addCase(updateUserApiThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(checkUserAuthThunk.rejected, (state, action) => {})
      .addCase(checkUserAuthThunk.fulfilled, (state, action) => {});
  }
});

export const { getUser, getAuthChecked } = userSlice.selectors;
export const userReducer = userSlice.reducer;
export const { setUser, setAuthChecked } = userSlice.actions;
