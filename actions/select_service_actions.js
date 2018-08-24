import { SELECT_SERVICE } from './types';

export const selectService = (service) => (dispatch) => {
    dispatch({ type: SELECT_SERVICE, payload: service });
};
