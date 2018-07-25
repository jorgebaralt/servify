
import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAIL,
    LOGIN_FAIL,
    LOGIN_SUCCESS
} from "./types";
import {Facebook} from 'expo';
import firebase from 'firebase'

//How to use AsyncStorage:
//AsyncStorage.setItem(''fb_token,token);
//AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    //get application ID
    let {type , token} = await Facebook.logInWithReadPermissionsAsync('270665710375213',{permissions: ['public_profile','email']});

    if(type === 'cancel'){
        dispatch({type:FACEBOOK_LOGIN_FAIL})
    }

    const credential = await firebase.auth.FacebookAuthProvider.credential(token);
    await firebase.auth().signInAndRetrieveDataWithCredential(credential)
        .catch((error) => {
            console.log(error)
        });

    //if everything worked fine, we dispatch success
    dispatch({type:FACEBOOK_LOGIN_SUCCESS,payload:token})
};

export const emailAndPasswordLogin = (email,password) => async (dispatch) =>{
    try{
        let {user} = await firebase.auth().signInWithEmailAndPassword(email,password);
        dispatch({type:LOGIN_SUCCESS,payload:user})
    }catch(e){
        dispatch({type:LOGIN_FAIL,payload:'Password and Email does not Match'})
    }
};

export const logOut = (callback) => async (dispatch) =>{
    await firebase.auth().signOut();
    callback();
};
