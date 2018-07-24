import {
    CREATE_ACCOUNT_FAIL,
    CREATE_ACCOUNT_SUCCESS
} from './types'
import axios from 'axios';
import firebase from 'firebase'
import {AsyncStorage} from 'react-native'

export const createEmailAccount = (user) => async (dispatch) =>{
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser'
    const {email,password,firstName,lastName} = user
    //check not empty
    if(email && password && firstName && lastName){
        if(password.length < 6){
            return dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Password must be at least 6 characters'})
        }
        //send data to server
        try{
            let {data} = await axios.post(url,{
                email,
                password,
                firstName,
                lastName
            })
            //Perform Login to Firebase
            let {user} = await firebase.auth().signInWithEmailAndPassword(email,password);
            console.log(user.refreshToken)
            dispatch({type:CREATE_ACCOUNT_SUCCESS,payload:data.uid});
        }catch(e){
            dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Email already exist or information is not valid'});
        }
    }else{
        dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Please fill all the information'})
    }
}