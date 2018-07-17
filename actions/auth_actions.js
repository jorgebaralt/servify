import {AsyncStorage} from 'react-native'
import {FACEBOOK_LOGIN_SUCCESS,FACEBOOK_LOGIN_FAIL} from "./types";
import {Facebook} from 'expo';

//How to use AsyncStorage:
//AsyncStorage.setItem(''fb_token,token);
//AsyncStorage.getItem('fb_token');

export const facebookLogin = () => async (dispatch) => {
    let token = await AsyncStorage.getItem('fb_token');
    if(token){
            //We
            dispatch({type: FACEBOOK_LOGIN_SUCCESS,payload:token})
        }else{
            doFacebookLogin();
        }
};


const doFacebookLogin = async () =>{
    //get application ID
    let {type , token} = await Facebook.logInWithReadPermissionsAsync('123',{permissions: ['public_profile']});
    if(type === 'cancel'){
        dispatch({type:FACEBOOK_LOGIN_FAIL})
    }

    await AsyncStorage.setItem('fb_token', token);

    dispatch({type:FACEBOOK_LOGIN_SUCCESS,payload:token})
};