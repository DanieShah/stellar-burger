import { expect, it, describe } from '@jest/globals';
import {
  TUserState,
  logoutApiThunk,
  registerUserApiThunk,
  setAuthChecked,
  setUser,
  updateUserApiThunk,
  userReducer
} from './api-user-silce';
import { TUser } from '@utils-types';
import { TRegisterData, TUserResponse } from '@api';
import { initialState } from './api-user-silce';

describe('тесты редюсеров [api-user-silce]', () => {
  const user1: TUser = {
    email: 'proverka@prov.pro',
    name: 'Test Test'
  };

  const userResponce: TUserResponse = {
    success: true,
    user: user1
  };

  it('редюсер [setAuthChecked]', () => {
    const { isAuthCheked } = userReducer(initialState, setAuthChecked(true));

    expect(isAuthCheked).toEqual(true);
  });

  it('Добавить пользователя, редюсер [setUser]', () => {
    const { user } = userReducer(initialState, setUser(user1));

    expect(user).toEqual(user1);
  });

  describe('тесты асинхронных экшенов', () => {
    
    const registerData: TRegisterData = {
      name: 'Test Name',
      email: 'test@email.com',
      password: '1111111'
    }

    it('редюсер [registerUserApiThunk.fulfilled]', () => {
      const actualState = userReducer(initialState, registerUserApiThunk.fulfilled(user1, '', registerData));

      expect(actualState).toEqual({
        ...initialState,
        user: user1
      });
    });

    it('редюсер [updateUserApiThunk.fulfilled]', () => {
      const actualState = userReducer(initialState, updateUserApiThunk.fulfilled(userResponce, '', registerData));

      expect(actualState).toEqual({
        ...initialState,
        user: user1
      })
    });
  });
});
