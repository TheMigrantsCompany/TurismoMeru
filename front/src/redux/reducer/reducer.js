import {
    CREATE_EXCURSION_FAILURE,
    CREATE_EXCURSION_REQUEST,
    CREATE_EXCURSION_SUCCESS,
} from "../actions/types";

const initialState = {
    excursion: {
        loading: false,
        excursion: null,
        error: null,
    }
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_EXCURSION_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_EXCURSION_SUCCESS:
            return { ...state, loading: false, excursion: action.payload, error: null };
        case CREATE_EXCURSION_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default rootReducer;