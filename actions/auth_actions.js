
import { Facebook } from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import {
  LOG_OUT,
  STORE_USER_DISPLAY_NAME,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  RESET_MESSAGE_CREATE
} from './types';

const addUserdbURL = 'https://us-central1-servify-716c6.cloudfunctions.net/addUserdb';
// How to use AsyncStorage:
// AsyncStorage.setItem(''fb_token,token);
// AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    try{
        const { type, token } = await Facebook.logInWithReadPermissionsAsync('270665710375213', { permissions: ['public_profile','email'] });

        if(type === 'cancel'){
            dispatch({ type: LOGIN_FAIL });
        }

        const credential = await firebase.auth.FacebookAuthProvider.credential(token);
        const { user } = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        await axios.post(addUserdbURL, { email: user.email, displayName: user.displayName });
        // if everything worked fine, we dispatch success and the displayName
        return dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
        // TODO: grab favorite list and store on device for fast access
    }catch (e) {
        return dispatch({ type: LOGIN_FAIL });
    }
};

export const emailAndPasswordLogin = (email, password) => async (dispatch) => {
    try{
        const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
        // TODO: grab favorite list and store on device for fast access
        return dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
    }catch(e){
        return dispatch({ type: LOGIN_FAIL, payload: 'Password and Email does not Match' });
    }
};

export const getCurrentUserDisplayName = () => async (dispatch) => {
    const { displayName } = await firebase.auth().currentUser;
    dispatch({ type: STORE_USER_DISPLAY_NAME, payload: displayName });
};

export const createEmailAccount = (user) => async (dispatch) => {
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser';
    const { email, password, firstName, lastName } = user;
    // check not empty
    if(email && password && firstName && lastName){
        if(password.length < 6){
            return dispatch({ type: LOGIN_FAIL, payload: 'Password must be at least 6 characters' });
        }
        // create the account
        try{
            await axios.post(url, {
                email,
                password,
                firstName,
                lastName
            });

            // Perform Login Using Firebase.
            const { loggedUser } = await firebase.auth().signInWithEmailAndPassword(email, password);
            await axios.post(addUserdbURL, { email, firstName, lastName });
            return dispatch({ type: LOGIN_SUCCESS, payload: loggedUser.displayName });
        }catch(e){
            return dispatch({ type: LOGIN_FAIL, payload: 'Email already exist or information is not valid' });
        }
    }else{
        return dispatch({ type: LOGIN_FAIL, payload: 'Please fill all the information' });
    }
  };

export const logOut = (callback1, callback2, callback3) => async (dispatch) => {
    await firebase.auth().signOut();

    await callback1();
    await callback2();
    await callback3();
    dispatch({ type: LOG_OUT });
};

export const resetMessageCreate = () => async (dispatch) => {
    dispatch({ type: RESET_MESSAGE_CREATE });
};
