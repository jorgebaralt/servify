import axios from 'axios';
import {
    GET_CATEGORY_FAIL,
    GET_CATEGORY_SUCCESS,
    GET_SUBCATEGORY_FAIL,
    GET_SUBCATEGORY_SUCCESS
} from './types';

const BASE_URL = 'https://us-central1-servify-716c6.cloudfunctions.net/getServices';

// TODO: grab db_reference of category and subcategory, append to url only 1. 
// if it has subcategory look for subcategory. else only category
export const getServicesCategory = (category) => async (dispatch) => {
    const url = BASE_URL + '/' + category;
    try {
        const { data } = await axios.get(url);
        return dispatch({ type: GET_CATEGORY_SUCCESS, payload: data });
    } catch(e) {
        return dispatch({ type: GET_CATEGORY_FAIL, payload: 'Error... Check your connection' });
    }
};

export const getServicesSubcategory = (category, subcategory) => async (dispatch) => {
    const url = BASE_URL + '/' + category + '/' + subcategory;
    try {
        const { data } = await axios.get(url);
        return dispatch({ type: GET_SUBCATEGORY_SUCCESS, payload: data });
    } catch(e) {
        return dispatch({ type: GET_SUBCATEGORY_FAIL });
    }
};
