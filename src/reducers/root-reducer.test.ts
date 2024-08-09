import { expect, it, describe } from '@jest/globals';
import { rootReducer } from './root-reducer';
import store from '../services/store';

describe('проверка инициализации rootReducer', () => {
    const initialState = undefined;

    it('Проверка с неизветным экшеном', () => {
        const actualState = rootReducer(initialState, { type: 'UNKNOWN_ACTION' });
        const startState = store.getState();

        expect(actualState).toEqual(startState);
    })
});