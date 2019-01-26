import firebase from 'firebase';
import {
	GET_CURRENT_USER,
} from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

export const getCurrentUser = () => async (dispatch) => {
	const response = await firebase.auth().currentUser;
	const { displayName, email, uid } = response;
	const user = { displayName, email, uid };
	return dispatch({ type: GET_CURRENT_USER, payload: user });
};
