import {
    CREATE_ACCOUNT_FAIL,
    CREATE_ACCOUNT_SUCCESS
} from './types'

export const createEmailAccount = ({email,password,firstName,lastName}) => async (dispatch) =>{
    //send email and password to back-end to create account.
    //if successful, dispatch Success
    //else dispatch fail
    //if not show error message
    console.log('Request to Create Account ' + email + password + firstName + lastName);
}