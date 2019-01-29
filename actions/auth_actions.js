import axios from 'axios';
import { GET_CURRENT_USER } from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

const userURL = 'https://us-central1-servify-716c6.cloudfunctions.net/user';

export const getCurrentUser = (uid, email) => async (dispatch) => {
	try {
		const { data } = await axios.get(userURL, {
			params: {
				uid
			}
		});
		const user = data;
		user.email = email;
		return dispatch({ type: GET_CURRENT_USER, payload: user });
	} catch (e) {
		console.log(e);
	}
};

export const updateCurrentUser = (updatedUser, uid) => async (dispatch) => {
	try {
		const { data } = await axios.put(userURL, { updatedUser, uid });
		const user = data;
		return dispatch({ type: GET_CURRENT_USER, payload: user });
	} catch (e) {
		console.log(e);
	}
};
