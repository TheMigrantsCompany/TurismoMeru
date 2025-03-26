import {
  CREATE_EXCURSION_FAILURE,
  CREATE_EXCURSION_REQUEST,
  CREATE_EXCURSION_SUCCESS,
  GET_ALL_SERVICES,
  GET_BOOKINGS_BY_SERVICE_REQUEST,
  GET_BOOKINGS_BY_SERVICE_SUCCESS,
  GET_BOOKINGS_BY_SERVICE_FAILURE,
  DELETE_SERVICE,
  TOGGLE_SERVICE_STATUS_SUCCESS,
  // Users
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  TOGGLE_USER_STATUS_SUCCESS,
  TOGGLE_USER_STATUS_FAILURE,
  TOGGLE_USER_STATUS_REQUEST,
  DELETE_USER_REQUEST,
  DELETE_USER_FAILURE,
  DELETE_USER_SUCCESS,
  GET_USER_DETAILS_REQUEST,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_USER_BY_NAME_REQUEST,
  GET_USER_BY_NAME_SUCCESS,
  GET_USER_BY_NAME_FAILURE,
  GET_USER_BY_DNI_REQUEST,
  GET_USER_BY_DNI_SUCCESS,
  GET_USER_BY_DNI_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,

  //ordenes
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ALL_ORDERS,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_ERROR,
  GET_ORDERS_BY_USER_REQUEST,
  GET_ORDERS_BY_USER_SUCCESS,
  GET_ORDERS_BY_USER_FAILURE,

  //bookings
  GET_ALL_BOOKINGS,
  GET_ALL_BOOKINGS_REQUEST,
  GET_ALL_BOOKINGS_ERROR,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,

  // Delete Booking
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAILURE,

  // Delete Service Order
  DELETE_SERVICE_ORDER_REQUEST,
  DELETE_SERVICE_ORDER_SUCCESS,
  DELETE_SERVICE_ORDER_FAILURE,
} from "../actions/types";

const initialState = {
  excursion: {
    loading: false,
    excursion: [],
    error: null,
  },
  bookingsByService: {
    loading: false,
    bookings: [],
    error: null,
  },
  users: {
    loading: false,
    userList: [], // Lista de usuarios
    filteredUsers: [], // Lista de usuarios filtrados
    userDetails: null, // Detalles del usuario seleccionado
    error: null, // Errores de la API
    id_User: null,
  },
  orders: {
    loading: false,
    order: null,
    error: null,
    ordersList: [],
    updateStatus: {
      loading: false,
      error: null,
    },
  },
  bookings: {
    loading: false,
    booking: null,
    error: null,
    bookingsList: [],
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EXCURSION_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_EXCURSION_SUCCESS:
      return {
        ...state,
        loading: false,
        excursion: action.payload,
        error: null,
      };
    case CREATE_EXCURSION_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case GET_ALL_SERVICES:
      return {
        ...state,
        excursions: action.payload,
      };
    case DELETE_SERVICE:
      return {
        ...state,
        excursions: state.excursions.filter(
          (excursion) => excursion.title !== action.payload
        ),
      };
    case TOGGLE_SERVICE_STATUS_SUCCESS:
      return {
        ...state,
        excursion: {
          ...state.excursion,
          excursion: state.excursion.excursion.map((service) =>
            service.id_Service === action.payload.id_Service
              ? { ...service, active: action.payload.active }
              : service
          ),
        },
      };
    // Reducer para manejar la búsqueda de bookings por servicio, fecha y hora
    case GET_BOOKINGS_BY_SERVICE_REQUEST:
      return {
        ...state,
        bookingsByService: {
          ...state.bookingsByService,
          loading: true,
          error: null,
        },
      };
    case GET_BOOKINGS_BY_SERVICE_SUCCESS:
      return {
        ...state,
        bookingsByService: {
          ...state.bookingsByService,
          loading: false,
          bookings: action.payload,
          error: null,
        },
      };
    case GET_BOOKINGS_BY_SERVICE_FAILURE:
      return {
        ...state,
        bookingsByService: {
          ...state.bookingsByService,
          loading: false,
          error: action.payload,
        },
      };

    //USERS
    case GET_USERS_REQUEST:
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          userList: action.payload, // Guardamos los usuarios en userList
          filteredUsers: action.payload, // Inicializamos filteredUsers con todos los usuarios
          error: null,
        },
      };

    case GET_USERS_FAILURE:
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    // Si estás filtrando usuarios, puedes agregar un case adicional para actualizar filteredUsers
    case "users/filterUsers":
      const filteredUsers = state.users.userList.filter(
        (user) =>
          user.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.email.toLowerCase().includes(action.payload.toLowerCase())
      );
      console.log("Filtrando usuarios:", filteredUsers);
      return {
        ...state,
        users: {
          ...state.users,
          filteredUsers, // Actualiza los usuarios filtrados
        },
      };

    case TOGGLE_USER_STATUS_REQUEST:
      return {
        ...state,
        users: {
          ...state.users,
          loading: true,
          error: null, // Reinicia errores previos
        },
      };

    case TOGGLE_USER_STATUS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          userList: state.users.userList.map((user) =>
            user.id_User === action.payload.id_User
              ? { ...user, active: action.payload.active }
              : user
          ),
        },
      };

    case TOGGLE_USER_STATUS_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          error: action.payload, // Registra el error
        },
      };

    case DELETE_USER_REQUEST:
      return {
        ...state,
        users: {
          ...state.users,
          loading: true,
          error: null, // Reinicia errores previos
        },
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          userList: state.users.userList.filter(
            (user) => user.id_User !== action.payload.id_User
          ),
        },
      };

    case DELETE_USER_FAILURE:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          error: action.payload, // Registra el error
        },
      };

    case GET_USER_DETAILS_REQUEST:
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_DETAILS_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          userDetails: action.payload,
          error: null,
        },
      };

    case GET_USER_DETAILS_FAILURE:
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case GET_USER_BY_NAME_REQUEST:
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_BY_NAME_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          userDetails: action.payload,
          error: null,
        },
      };

    case GET_USER_BY_NAME_FAILURE:
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case GET_USER_BY_DNI_REQUEST:
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_BY_DNI_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          userDetails: action.payload,
          error: null,
        },
      };

    case GET_USER_BY_DNI_FAILURE:
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case UPDATE_USER_REQUEST:
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          userList: state.users.userList.map((user) =>
            user.id_User === action.payload.id_User ? action.payload : user
          ),
          userDetails: action.payload, // Actualizamos también los detalles del usuario si aplica
          error: null,
        },
      };

    case UPDATE_USER_FAILURE:
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    //ORDENES DE SERVICIO
    //crear ordenes de servicio
    case CREATE_ORDER_REQUEST:
      return { ...state, loading: true };
    case CREATE_ORDER_SUCCESS:
      return { ...state, loading: false, order: action.payload };
    case CREATE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //obtener todas las ordenes de servicio
    case GET_ALL_ORDERS_REQUEST:
      return {
        ...state,
        orders: {
          ...state.orders, // Mantén el resto del estado de `orders`
          loading: true, // Cambia solo `loading`
        },
      };

    case GET_ALL_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders, // Mantén el resto del estado de `orders`
          loading: false, // Cambia `loading` a false
          ordersList: action.payload, // Actualiza la lista de órdenes
          error: null, // Resetea errores
        },
      };

    case GET_ALL_ORDERS_ERROR:
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: false, // Desactiva el estado de carga
          error: action.payload, // Guarda el mensaje de error
        },
      };

    case GET_ORDERS_BY_USER_REQUEST:
      return {
        ...state,
        loading: true, // Activamos el estado de carga
      };

    case GET_ORDERS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        ordersList: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };

    case GET_ORDERS_BY_USER_FAILURE:
      return {
        ...state,
        loading: false, // Desactivamos `loading`
        error: action.payload, // Guardamos el error
      };

    case GET_ALL_BOOKINGS:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          loading: false,
          bookingsList: action.payload, // Aquí debes asegurar que se asignen los bookings a bookingsList
        },
      };

    case UPDATE_ORDER_STATUS_REQUEST:
      return {
        ...state,
        orders: {
          ...state.orders,
          updateStatus: {
            loading: true,
            error: null,
          },
        },
      };

    case UPDATE_ORDER_STATUS_SUCCESS:
      return {
        ...state,
        orders: {
          ...state.orders,
          updateStatus: {
            loading: false,
            error: null,
          },
        },
      };

    case UPDATE_ORDER_STATUS_FAILURE:
      return {
        ...state,
        orders: {
          ...state.orders,
          updateStatus: {
            loading: false,
            error: action.payload,
          },
        },
      };

    case DELETE_BOOKING_REQUEST:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          loading: true,
          error: null,
        },
      };

    case DELETE_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          loading: false,
          bookingsList: state.bookings.bookingsList.filter(
            (booking) => booking.id_Booking !== action.payload
          ),
          error: null,
        },
      };

    case DELETE_BOOKING_FAILURE:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          loading: false,
          error: action.payload,
        },
      };

    case DELETE_SERVICE_ORDER_REQUEST:
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: true,
          error: null,
        },
      };

    case DELETE_SERVICE_ORDER_SUCCESS:
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: false,
          ordersList: state.orders.ordersList.filter(
            (order) => order.id_ServiceOrder !== action.payload
          ),
          error: null,
        },
      };

    case DELETE_SERVICE_ORDER_FAILURE:
      return {
        ...state,
        orders: {
          ...state.orders,
          loading: false,
          error: action.payload,
        },
      };
      
      case "UPDATE_EXCURSION_STOCK":
      return {
        ...state,
        excursion: {
          ...state.excursion,
          excursion: state.excursion.excursion.map((service) =>
            service.id_Service === action.payload.id_Service
              ? {
                  ...service,
                  stock: action.payload.totalStock,
                  availabilityDate: action.payload.availabilityDate,
                }
              : service
          ),
        },
      };


    default:
      return state;
  }
};

export default rootReducer;
