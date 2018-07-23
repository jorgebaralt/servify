import {
    CREATE_ACCOUNT_FAIL,
    CREATE_ACCOUNT_SUCCESS
} from './types'

export const createEmailAccount = (user) => async (dispatch) =>{
    const {email,password,firstName,lastName,phone} = user
    //check not empty
    if(email && password && firstName && lastName && phone ){
        //send email and password to back-end to create account.
        //if successful, dispatch Success
    }else{
        dispatch({CREATE_ACCOUNT_FAIL})
    }
}