import {
    CREATE_EXCURSION_FAILURE,
    CREATE_EXCURSION_REQUEST,
    CREATE_EXCURSION_SUCCESS,
    GET_ALL_SERVICES,
    DELETE_SERVICE,
    TOGGLE_SERVICE_STATUS_SUCCESS,
} from "../actions/types";

const initialState = {
    excursion: {
        loading: false,
        excursion: [],
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

         case GET_ALL_SERVICES:
                return {
                  ...state,
                  excursions: action.payload
                };
         case DELETE_SERVICE:
                return {
                  ...state,
                  excursions: state.excursions.filter(excursion => excursion.title !== action.payload)
                    };
                    case TOGGLE_SERVICE_STATUS_SUCCESS:
                        return state.map(service =>
                          service.id === action.payload.id_Service ? { ...service, active: action.payload.active } : service
                        );            
        default:
            return state;
    }
    
};

export default rootReducer;