import axios from 'axios';
import {
    GET_SERVICES_FAIL,
    GET_SERVICES_SUCCESS
} from './types';

const GET_URL = 'https://us-central1-servify-716c6.cloudfunctions.net/getServices';

// TODO: grab db_reference of category and subcategory, append to url only 1. 
// if it has subcategory look for subcategory. else only category
export const getServicesCategory = (category) => async (dispatch) => {
    const url = GET_URL + '/?category=' + category;
    try {
        const { data } = await axios.get(url);
        return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
    } catch(e) {
        return dispatch({ type: GET_SERVICES_FAIL, payload: 'Error... Check your connection' });
    }
};

export const getServicesSubcategory = (category, subcategory) => async (dispatch) => {
    const url = GET_URL + '/?subcategory=' + subcategory;
    try {
        const { data } = await axios.get(url);
        return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
    } catch(e) {
        return dispatch({ type: GET_SERVICES_FAIL });
    }
};

export const getServicesByEmail = (email) => async (dispatch) => {
    const url = GET_URL + '/?email=' + email;
    try {
        // TODO: change here
        const { data } = await axios.get(url);
        return dispatch({ type: GET_SERVICES_SUCCESS, payload: data });
    } catch(e) {
        console.log(e);
        return dispatch({ type: GET_SERVICES_FAIL });
    }
};
