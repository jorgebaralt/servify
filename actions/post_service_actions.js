import { POST_SERVICE_SUCCESS, POST_SERVICE_FAIL } from "./types";

export const createService = (servicePost) => async (dispatch) => {
    console.log(servicePost);
    const {selectedCategory,selectedSubcategory,phone,location,description,title} = servicePost;
};
