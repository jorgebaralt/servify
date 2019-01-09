import { SHOW_TOAST } from '../actions/types';

export default (state = {}, action) => {
	switch (action.type) {
		case SHOW_TOAST:
			return {
				show: true,
				message: action.payload.message,
				type: action.payload.type,
				duration: action.payload.duration
			};
		default:
			return state;
	}
};
