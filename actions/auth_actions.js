import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAIL,
    EMAIL_LOGIN_FAIL,
    EMAIL_LOGIN_SUCCESS,
    LOG_OUT,
    STORE_USER_DISPLAY_NAME, CREATE_ACCOUNT_SUCCESS
} from "./types";
import {Facebook} from 'expo';
import firebase from 'firebase'
import axios from "axios";

//How to use AsyncStorage:
//AsyncStorage.setItem(''fb_token,token);
//AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    //get application ID
    try{
        let {type , token} = await Facebook.logInWithReadPermissionsAsync('270665710375213',{permissions: ['public_profile','email']});

        if(type === 'cancel'){
            dispatch({type:FACEBOOK_LOGIN_FAIL})
        }

        const credential = await firebase.auth.FacebookAuthProvider.credential(token);
        let {user} = await firebase.auth().signInAndRetrieveDataWithCredential(credential)
            .catch(() => {
                dispatch({type:FACEBOOK_LOGIN_FAIL})
            });

        //if everything worked fine, we dispatch success and the displayName
        dispatch({type:FACEBOOK_LOGIN_SUCCESS,payload:user.displayName})
    }catch (e) {
        console.log('facebook canceled')
    }

};

export const emailAndPasswordLogin = (email,password) => async (dispatch) =>{
    try{
        let {user} = await firebase.auth().signInWithEmailAndPassword(email,password);
        dispatch({type:EMAIL_LOGIN_SUCCESS,payload:user.displayName})
    }catch(e){
        dispatch({type:EMAIL_LOGIN_FAIL,payload:'Password and Email does not Match'})
    }
};

export const getCurrentUserDisplayName = () => async (dispatch) =>{
    let {displayName} = await firebase.auth().currentUser;
    dispatch({type:STORE_USER_DISPLAY_NAME,payload:displayName});
};

export const createEmailAccount = (user) => async (dispatch) =>{
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser';
    const {email,password,firstName,lastName} = user;
    //check not empty
    if(email && password && firstName && lastName){
        if(password.length < 6){
            return dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Password must be at least 6 characters'})
        }
        //create the account
        try{
            await axios.post(url,{
                email,
                password,
                firstName,
                lastName
            });
            //Perform Login Using Firebase.
            let {user} = await firebase.auth().signInWithEmailAndPassword(email,password);
            dispatch({type:CREATE_ACCOUNT_SUCCESS,payload:user.displayName});
        }catch(e){
            dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Email already exist or information is not valid'});
        }
    }else{
        dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Please fill all the information'})
    }
};

export const logOut = (callback1,callback2,callback3) => async (dispatch) =>{
    await firebase.auth().signOut();

    await callback1();
    await callback2();
    await callback3();
    dispatch({type:LOG_OUT});

};

