import { SHOW_TOAST } from './types';

export const showToast = ({ message, type, duration }) => async (dispatch) => {
	return dispatch({ type: SHOW_TOAST, payload: { message, type, duration } });
};
