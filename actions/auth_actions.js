import {AsyncStorage} from 'react-native'
import {
    FACEBOOK_LOGIN_SUCCESS,
    FACEBOOK_LOGIN_FAIL,
    LOGIN_FAIL,
    LOGIN_SUCESS
} from "./types";
import {Facebook} from 'expo';
import firebase from 'firebase'

//How to use AsyncStorage:
//AsyncStorage.setItem(''fb_token,token);
//AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    let token = await AsyncStorage.getItem('login_token');
    if(token){
            dispatch({type: FACEBOOK_LOGIN_SUCCESS,payload:token})
        }else{
            await doFacebookLogin(dispatch) 
        }
};

export const emailAndPasswordLogin = (email,password) => async (dispatch) =>{
    try{
        let {user} = await firebase.auth().signInWithEmailAndPassword(email,password);
        await AsyncStorage.setItem('login_token',user.refreshToken);
        dispatch({type:LOGIN_SUCESS,payload:user})
    }catch(e){
        dispatch({type:LOGIN_FAIL,payload:'Password and Email does not Match'})
    }
}

const doFacebookLogin = async (dispatch) =>{
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
    
    await AsyncStorage.setItem('login_token', token);
    //if everything worked fine, we dispatch success
    dispatch({type:FACEBOOK_LOGIN_SUCCESS,payload:token})
};
