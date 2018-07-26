
import { Facebook } from 'expo';
import firebase from 'firebase';
import axios from 'axios';
import {
  LOG_OUT,
  STORE_USER_DISPLAY_NAME,
  LOGIN_FAIL,
  LOGIN_SUCCESS
} from './types';

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
        const { user } = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .catch(() => {
                dispatch({ type: LOGIN_FAIL });
            });

        // if everything worked fine, we dispatch success and the displayName
        dispatch({ type: LOGIN_SUCCESS,payload: user.displayName });
    }catch (e) {
        console.log('facebook canceled');
    }

};

export const emailAndPasswordLogin = (email, password) => async (dispatch) => {
    try{
        const { user } = await firebase.auth().signInWithEmailAndPassword(email,password);
        dispatch({ type: LOGIN_SUCCESS, payload: user.displayName });
    }catch(e){
        dispatch({ type: LOGIN_FAIL,payload:'Password and Email does not Match' });
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
            await axios.post(url,{
                email,
                password,
                firstName,
                lastName
            });

            // Perform Login Using Firebase.
            const { loggedUser } = await firebase.auth()
              .signInWithEmailAndPassword(email, password);

            dispatch({ type: LOGIN_SUCCESS, payload: loggedUser.displayName });
        }catch(e){
            dispatch({ type: LOGIN_FAIL, payload: 'Email already exist or information is not valid' });
        }
    }else{
        return dispatch({ type: LOGIN_FAIL, payload: 'Please fill all the information' });
    }
    return dispatch({ type: LOGIN_FAIL, payload: 'Please Fill With Valid Information' });
  };

export const logOut = (callback1, callback2, callback3) => async (dispatch) => {
    await firebase.auth().signOut();

    await callback1();
    await callback2();
    await callback3();
    dispatch({ type: LOG_OUT });
};
