import axios from 'axios';
import {
    CREATE_EXCURSION_FAILURE,
    CREATE_EXCURSION_REQUEST,
    CREATE_EXCURSION_SUCCESS,
    GET_ALL_SERVICES,
} from "./types";

export const createExcursion = (excursionData) => async (dispatch) => {
    dispatch({ type: CREATE_EXCURSION_REQUEST });
    try {
      const response = await axios.post('http://localhost:3001/service/', excursionData);
      dispatch({
        type: CREATE_EXCURSION_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_EXCURSION_FAILURE,
        payload: error.message,
      });
    }
  };
  export const getAllServices = () => async (dispatch) => {
    try {
      const response = await axios.get('http://localhost:3001/service'); 
      dispatch({
        type: GET_ALL_SERVICES,
        payload: response.data
      });
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };