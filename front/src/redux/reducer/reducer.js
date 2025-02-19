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
      console.log("Reducer - GET_USERS_REQUEST: Solicitando usuarios");
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USERS_SUCCESS:
      console.log(
        "Reducer - GET_USERS_SUCCESS: Usuarios obtenidos con éxito",
        action.payload
      );
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
      console.error(
        "Reducer - GET_USERS_FAILURE: Error al obtener usuarios",
        action.payload
      );
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
      console.log(
        "Reducer - TOGGLE_USER_STATUS_REQUEST: Solicitando cambio de estado de usuario"
      );
      return {
        ...state,
        users: {
          ...state.users,
          loading: true,
          error: null, // Reinicia errores previos
        },
      };

    case TOGGLE_USER_STATUS_SUCCESS:
      console.log(
        "Reducer - TOGGLE_USER_STATUS_SUCCESS: Estado de usuario cambiado con éxito",
        action.payload
      );
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
      console.error(
        "Reducer - TOGGLE_USER_STATUS_FAILURE: Error al cambiar el estado del usuario",
        action.payload
      );
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          error: action.payload, // Registra el error
        },
      };

    case DELETE_USER_REQUEST:
      console.log(
        "Reducer - DELETE_USER_REQUEST: Solicitando eliminación de usuario"
      );
      return {
        ...state,
        users: {
          ...state.users,
          loading: true,
          error: null, // Reinicia errores previos
        },
      };

    case DELETE_USER_SUCCESS:
      console.log(
        "Reducer - DELETE_USER_SUCCESS: Usuario eliminado con éxito",
        action.payload
      );
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
      console.error(
        "Reducer - DELETE_USER_FAILURE: Error al eliminar usuario",
        action.payload
      );
      return {
        ...state,
        users: {
          ...state.users,
          loading: false,
          error: action.payload, // Registra el error
        },
      };

    case GET_USER_DETAILS_REQUEST:
      console.log(
        "Reducer - GET_USER_DETAILS_REQUEST: Solicitando detalles de usuario"
      );
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_DETAILS_SUCCESS:
      console.log("Actualizando userDetails en el reducer", action.payload);
      console.log(
        "Reducer - GET_USER_DETAILS_SUCCESS: Detalles de usuario obtenidos con éxito",

        action.payload
      );
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
      console.error(
        "Reducer - GET_USER_DETAILS_FAILURE: Error al obtener detalles de usuario",
        action.payload
      );
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case GET_USER_BY_NAME_REQUEST:
      console.log(
        "Reducer - GET_USER_BY_NAME_REQUEST: Solicitando usuario por nombre"
      );
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_BY_NAME_SUCCESS:
      console.log(
        "Reducer - GET_USER_BY_NAME_SUCCESS: Usuario encontrado por nombre",
        action.payload
      );
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
      console.error(
        "Reducer - GET_USER_BY_NAME_FAILURE: Error al buscar usuario por nombre",
        action.payload
      );
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case GET_USER_BY_DNI_REQUEST:
      console.log(
        "Reducer - GET_USER_BY_DNI_REQUEST: Solicitando usuario por DNI"
      );
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case GET_USER_BY_DNI_SUCCESS:
      console.log(
        "Reducer - GET_USER_BY_DNI_SUCCESS: Usuario encontrado por DNI",
        action.payload
      );
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
      console.error(
        "Reducer - GET_USER_BY_DNI_FAILURE: Error al buscar usuario por DNI",
        action.payload
      );
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case UPDATE_USER_REQUEST:
      console.log(
        "Reducer - UPDATE_USER_REQUEST: Solicitando actualización de usuario"
      );
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case UPDATE_USER_SUCCESS:
      console.log(
        "Reducer - UPDATE_USER_SUCCESS: Usuario actualizado con éxito",
        action.payload
      );
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
      console.error(
        "Reducer - UPDATE_USER_FAILURE: Error al actualizar usuario",
        action.payload
      );
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    case UPDATE_USER_REQUEST:
      console.log(
        "Reducer - UPDATE_USER_REQUEST: Solicitando actualización de usuario"
      );
      return {
        ...state,
        users: { ...state.users, loading: true, error: null },
      };

    case UPDATE_USER_SUCCESS:
      console.log(
        "Reducer - UPDATE_USER_SUCCESS: Usuario actualizado con éxito",
        action.payload
      );
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
      console.error(
        "Reducer - UPDATE_USER_FAILURE: Error al actualizar usuario",
        action.payload
      );
      return {
        ...state,
        users: { ...state.users, loading: false, error: action.payload },
      };

    //ORDENES DE SERVICIO
    //crear ordenes de servicio
    case CREATE_ORDER_REQUEST:
      return { ...state, loading: true };
    case CREATE_ORDER_SUCCESS:
      console.log("Orden recibida en el reducer:", action.payload);
      return { ...state, loading: false, order: action.payload };
    case CREATE_ORDER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //obtener todas las ordenes de servicio
    case GET_ALL_ORDERS_REQUEST:
      return {
        ...state,
        orders: {
          ...state.orders, // Mantén el resto del estado de `orders`
          loading: true,   // Cambia solo `loading`
        },
      };

    case GET_ALL_ORDERS:
      return {
        ...state,
        orders: {
          ...state.orders,      // Mantén el resto del estado de `orders`
          loading: false,       // Cambia `loading` a false
          ordersList: action.payload, // Actualiza la lista de órdenes
          error: null,          // Resetea errores
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
      console.log("Órdenes obtenidas:", action.payload);
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


    default:
      return state;
  }
};

export default rootReducer;
