import {
    CREATE_ACCOUNT_FAIL,
    CREATE_ACCOUNT_SUCCESS
} from './types'
import axios from 'axios';

export const createEmailAccount = (user) => async (dispatch) =>{
    const url = 'https://us-central1-servify-716c6.cloudfunctions.net/createUser'
    const {email,password,firstName,lastName} = user
    //check not empty
    if(email && password && firstName && lastName){
        //send data to server
        axios.post(url,{
            email,
            password,
            firstName,
            lastName
        }).then((user)=>{
            console.log("Success account created" + user);
            dispatch({type:CREATE_ACCOUNT_SUCCESS,payload:user});
        }).catch((error)=>{
            console.log('Error axios');
            dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Email already exist, try a different one'});
        });
    }else{
        dispatch({type:CREATE_ACCOUNT_FAIL,payload:'Please fill all the information'})
    }
}