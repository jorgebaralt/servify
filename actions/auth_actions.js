import { Facebook, Location } from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import {
	LOG_OUT,
	STORE_USER_DISPLAY_NAME,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	RESET_MESSAGE_CREATE,
	GET_EMAIL_FAIL,
	GET_EMAIL_SUCCESS,
	GET_USER_LOCATION_SUCCESS,
	GET_USER_LOCATION_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL
    
} from './types';
import { getFavorites } from './favorite_actions';

const addUserdbURL =	'https://us-central1-servify-716c6.cloudfunctions.net/addUserdb';
// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
	try {
		const { type, token } = await Facebook.logInWithReadPermissionsAsync(
			'270665710375213',
			{ permissions: ['public_profile', 'email'] }
		);

		if (type === 'cancel') {
			return dispatch({ type: LOGIN_FAIL });
		}

		const credential = await firebase.auth.FacebookAuthProvider.credential(
			token
		);
		const { user } = await firebase
			.auth()
			.signInAndRetrieveDataWithCredential(credential);
		await axios.post(addUserdbURL, {
			email: user.email,
			displayName: user.displayName
		});
		await getFavorites(user.email);
		// if everything worked fine, we dispatch success and the displayName
		return dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
		// TODO: grab favorite list and store on device for fast access
	} catch (e) {
		return dispatch({ type: LOGIN_FAIL });
	}
};

export const emailAndPasswordLogin = (email, password) => async (dispatch) => {
	try {
		const { user } = await firebase
			.auth()
			.signInWithEmailAndPassword(email, password);
		await getFavorites(email);
		await getEmail();
		// TODO: grab favorite list and store on device for fast access
		return dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
	} catch (e) {
		console.log(e);
		return dispatch({
			type: LOGIN_FAIL,
			payload: 'Password and Email does not Match'
		});
	}
};

export const getCurrentUserDisplayName = () => async (dispatch) => {
	const { displayName } = await firebase.auth().currentUser;
	return dispatch({ type: STORE_USER_DISPLAY_NAME, payload: displayName });
};

export const createEmailAccount = (newUser) => async (dispatch) => {
	const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser';
	const { email, password, firstName, lastName } = newUser;
	// check not empty
	if (email && password && firstName && lastName) {
		if (password.length < 6) {
			return dispatch({
				type: LOGIN_FAIL,
				payload: 'Password must be at least 6 characters'
			});
		}
		// create the account
		try {
			await axios.post(url, {
				email,
				password,
				firstName,
				lastName
			});

			// Perform Login Using Firebase.
			const displayName = firstName + ' ' + lastName;
			await axios.post(addUserdbURL, { email, displayName });
			const { user } = await firebase
				.auth()
				.signInWithEmailAndPassword(email, password);
			await user.sendEmailVerification();
			return dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
		} catch (e) {
			console.log(e);
			return dispatch({
				type: LOGIN_FAIL,
				payload: 'Email already exist or information is not valid'
			});
		}
	} else {
		return dispatch({
			type: LOGIN_FAIL,
			payload: 'Please fill all the information'
		});
	}
};

export const logOut = () => async (dispatch) => {
	await firebase.auth().signOut();
	return dispatch({ type: LOG_OUT });
};

export const resetMessage = () => async (dispatch) => dispatch({ type: RESET_MESSAGE_CREATE });

export const passwordReset = (email) => async (dispatch) => {
	console.log('reseting pass');
	try {
		await firebase.auth().sendPasswordResetEmail(email);
		return dispatch({
			type: PASSWORD_RESET_SUCCESS,
			payload: 'Email with password reset link has been sent'
		});
	} catch (e) {
		console.log(e);
		return dispatch({
			type: PASSWORD_RESET_FAIL,
			payload: 'Could not find provided email'
		});
	}
};

export const getEmail = () => async (dispatch) => {
	try {
		const { email } = await firebase.auth().currentUser;
		return dispatch({ type: GET_EMAIL_SUCCESS, payload: email });
	} catch (e) {
		console.log(e);
		return dispatch({ type: GET_EMAIL_FAIL });
	}
};

export const getUserLocation = () => async (dispatch) => {
	try {
		const location = await Location.getCurrentPositionAsync({
			enableHighAccuracy: true
		});
		dispatch({ type: GET_USER_LOCATION_SUCCESS, payload: location });
	} catch (e) {
		console.log(e);
		dispatch({ type: GET_USER_LOCATION_FAIL });
	}
};
