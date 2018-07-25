import firebase from "firebase";
import {STORE_USER_DISPLAY_NAME} from "./types";

export const getCurrentUserDisplayName = () => async (dispatch) =>{
    let {displayName} = await firebase.auth().currentUser;
    dispatch({type:STORE_USER_DISPLAY_NAME,payload:displayName});
};