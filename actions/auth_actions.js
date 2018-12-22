import firebase from 'firebase';
import {
	GET_CURRENT_USER,
	STORE_USER_DISPLAY_NAME,
	GET_EMAIL_FAIL,
	GET_EMAIL_SUCCESS,
    
} from './types';

// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

export const getCurrentUser = () => async (dispatch) => {
	const { displayName, email } = await firebase.auth().currentUser;
	const user = { displayName, email };
	return dispatch({ type: GET_CURRENT_USER, payload: user });
};
