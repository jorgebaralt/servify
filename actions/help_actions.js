import { SELECT_FAQ, DESELECT_FAQ } from './types';


export const selectFaq = (faq) => (dispatch) => {
	dispatch({ type: SELECT_FAQ, payload: faq });
};

export const deselectFaq = () => (dispatch) => {
	dispatch({ type: DESELECT_FAQ });
};
