import firebase from 'firebase';
import axios from 'axios';
import {
	GET_CURRENT_USER,
} from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

const userURL = 'https://us-central1-servify-716c6.cloudfunctions.net/user';

export const getCurrentUser = (uid) => async (dispatch) => {
	const { data } = await axios.get(userURL, {
		params: {
			uid
		},
	});
	const user = data;
	return dispatch({ type: GET_CURRENT_USER, payload: user });
};
