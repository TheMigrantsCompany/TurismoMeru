import axios from "axios";
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
  //users
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
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  GET_ALL_ORDERS,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_ERROR,
  GET_ORDERS_BY_USER_REQUEST,
  GET_ORDERS_BY_USER_SUCCESS,
  GET_ORDERS_BY_USER_FAILURE,
  GET_ALL_BOOKINGS,
  GET_ALL_BOOKINGS_REQUEST,
  GET_ALL_BOOKINGS_ERROR,
  //actualizacion de estado de pago manual
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  DELETE_BOOKING_REQUEST,
  DELETE_BOOKING_SUCCESS,
  DELETE_BOOKING_FAILURE,
  DELETE_SERVICE_ORDER_REQUEST,
  DELETE_SERVICE_ORDER_SUCCESS,
  DELETE_SERVICE_ORDER_FAILURE,
} from "./types";

export const createExcursion = (excursionData) => async (dispatch) => {
  dispatch({ type: CREATE_EXCURSION_REQUEST });
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/service/`,
      excursionData
    );
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

export const getBookingsByService =
  (id_Service, date, time, page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: GET_BOOKINGS_BY_SERVICE_REQUEST });

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/booking/service/${id_Service}?date=${date}&time=${time}&page=${page}&limit=${limit}`
      );
      dispatch({
        type: GET_BOOKINGS_BY_SERVICE_SUCCESS,
        payload: response.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_BOOKINGS_BY_SERVICE_FAILURE,
        payload: error.message,
      });
    }
  };

export const getAllServices = () => async (dispatch) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/service`);
    dispatch({
      type: GET_ALL_SERVICES,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};

export const deleteService = (title) => async (dispatch) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/service/name/${title}`
    );
    dispatch({ type: DELETE_SERVICE, payload: title });
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const toggleServiceActiveStatus = (id_Service) => async (dispatch) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/service/${id_Service}/toggle`
    );
    dispatch({
      type: TOGGLE_SERVICE_STATUS_SUCCESS,
      payload: {
        id_Service: response.data.id_Service,
        active: response.data.active,
      },
    });
  } catch (error) {
    console.error("Error toggling service status:", error);
  }
};

//ACTIONS USERS

//GET todos los users
export const getUsers = () => async (dispatch) => {
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`);
    console.log(
      "Actions - getUsers: Usuarios obtenidos con éxito:",
      response.data
    );
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    
    dispatch({ type: GET_USERS_FAILURE, payload: error.message });
  }
};

//TOGGLE user por id (activa y desactiva)
export const toggleUserActiveStatus = (id_User) => async (dispatch) => {
  console.log(
    `Actions - toggleUserActiveStatus: Cambiando estado de usuario con ID: ${id_User}`
  );
  dispatch({ type: TOGGLE_USER_STATUS_REQUEST }); // Inicio del proceso
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/user/${id_User}/active`
    );
    console.log(
      "Actions - toggleUserActiveStatus: Estado cambiado con éxito para usuario:",
      response.data
    );
    dispatch({ type: TOGGLE_USER_STATUS_SUCCESS, payload: response.data }); // Éxito
  } catch (error) {
    console.error(
      "Actions - toggleUserActiveStatus: Error al cambiar el estado:",
      error.message
    );
    dispatch({ type: TOGGLE_USER_STATUS_FAILURE, payload: error.message }); // Error registrado en el estado global
  }
};

//DELETE user por ID
export const deleteUser = (id_User) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST }); // Inicio del proceso
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/user/id/${id_User}`
    );
    console.log("Actions - deleteUser: Usuario eliminado con éxito:", id_User);
    dispatch({ type: DELETE_USER_SUCCESS, payload: id_User }); // Éxito
  } catch (error) {
    console.error(
      "Actions - deleteUser: Error al eliminar usuario:",
      error.message
    );
    dispatch({ type: DELETE_USER_FAILURE, payload: error.message }); // Error registrado en el estado global
  }
};

//GET user por ID
export const getUserDetails = (id_User) => async (dispatch) => {
  console.log(
    `Actions - getUserDetails: Obteniendo detalles para usuario con ID: ${id_User}`
  );
  dispatch({ type: GET_USER_DETAILS_REQUEST });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/id/${id_User}`
    );
    console.log(id_User);
    console.log(
      "Actions - getUserDetails: Detalles del usuario obtenidos:",
      response.data
    );
    dispatch({ type: GET_USER_DETAILS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(
      "Actions - getUserDetails: Error al obtener detalles del usuario:",
      error.message
    );
    dispatch({ type: GET_USER_DETAILS_FAILURE, payload: error.message });
  }
};

//GET user por nombre
export const getUserByName = (name) => async (dispatch) => {
  
  dispatch({ type: GET_USER_BY_NAME_REQUEST });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/name/${name}`
    );
    
    dispatch({ type: GET_USER_BY_NAME_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(
      "Actions - getUserByName: Error al buscar usuario por nombre:",
      error.message
    );
    dispatch({ type: GET_USER_BY_NAME_FAILURE, payload: error.message });
  }
};

//GET user por DNI
export const getUserByDni = (dni) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_DNI_REQUEST });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/user/DNI/${dni}`
    );
    dispatch({ type: GET_USER_BY_DNI_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(
      "Actions - getUserByDni: Error al buscar usuario por DNI:",
      error.message
    );
    dispatch({ type: GET_USER_BY_DNI_FAILURE, payload: error.message });
  }
};

//UPDATE user por ID
export const updateUserDetails = (id_User, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/user/id/${id_User}`,
      updatedData
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
  }
};

//ORDENES DE SERVICIO
export const createServiceOrder = (orderData) => async (dispatch) => {
  try {
   
    const jsonData = JSON.stringify(orderData);
    const response = await fetch( `${import.meta.env.VITE_API_URL}/servicesOrder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Error al crear la orden");
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });
    return data.order;
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: error.message,
    });
  }
};

//GET todas las ordenes de servicio
export const getAllOrders = () => async (dispatch) => {
  dispatch({ type: GET_ALL_ORDERS_REQUEST });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/servicesOrder/`
    );
    dispatch({ type: GET_ALL_ORDERS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ALL_ORDERS_ERROR, payload: error.message });
  }
};

//ACTIONS BOOKINGS
//todos los bookings

export const getAllBookings = () => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOKINGS_REQUEST });
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/booking/`
    );
    dispatch({ type: GET_ALL_BOOKINGS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ALL_BOOKINGS_ERROR, payload: error.message });
  }
};

//GET ordenes de servicio por usuario
export const getOrdersByUser = (id_User) => async (dispatch) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/servicesOrder/user/${id_User}`
    );
    dispatch({ type: GET_ORDERS_BY_USER_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ORDERS_BY_USER_FAILURE, payload: error.message });
  }
};



export const updateOrderStatus =
  (id_ServiceOrder, newStatus, currentOrder) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });
    try {
      if (newStatus === "Pendiente" && currentOrder.paymentInformation) {
        // Para cada item en paymentInformation, restauramos el stock
        for (const item of currentOrder.paymentInformation) {
          try {
            // Obtener el servicio
            const serviceResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/service/id/${item.id_Service}`
            );
            const service = serviceResponse.data;

            // Restaurar el stock específico y global
            const updatedAvailabilityDate = service.availabilityDate.map(
              (slot) => {
                if (slot.date === item.date && slot.time === item.time) {
                  return {
                    ...slot,
                    stock:
                      Number(slot.stock) +
                      Number(item.totalPeople || item.lockedStock),
                  };
                }
                return slot;
              }
            );

            // Actualizar el servicio con el stock restaurado
            await axios.put(
              `${import.meta.env.VITE_API_URL}/service/id/${item.id_Service}`,
              {
                ...service,
                stock:
                  service.stock + Number(item.totalPeople || item.lockedStock),
                availabilityDate: updatedAvailabilityDate,
              }
            );
          } catch (error) {
            console.error(
              `Error restaurando stock para servicio ${item.id_Service}:`,
              error
            );
          }
        }

        // Eliminar los bookings asociados
        const allBookings = await axios.get(`${import.meta.env.VITE_API_URL}/booking`); // <-- Corregido aquí
        const orderBookings = allBookings.data.filter(
          (booking) => booking.id_ServiceOrder === id_ServiceOrder
        );

        for (const booking of orderBookings) {
          try {
            await axios.delete(
              `${import.meta.env.VITE_API_URL}/booking/id/${booking.id_Booking}`
            );
          } catch (error) {
            console.error(
              `Error eliminando booking ${booking.id_Booking}:`,
              error
            );
          }
        }
      }

      // Actualizar el estado de la orden
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/servicesOrder/id/${id_ServiceOrder}`,
        { paymentStatus: newStatus }
      );

      dispatch({
        type: UPDATE_ORDER_STATUS_SUCCESS,
        payload: response.data,
      });

      // Recargar datos
      await dispatch(getAllOrders());
      await dispatch(getAllBookings());
      await dispatch(getAllServices());

      return response.data;
    } catch (error) {
      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

// Eliminar Orden de Servicio
export const deleteServiceOrder = (id_ServiceOrder) => async (dispatch) => {
  dispatch({ type: DELETE_SERVICE_ORDER_REQUEST });
  try {
    if (!id_ServiceOrder) {
      throw new Error("ID de orden no válido");
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/servicesOrder/id/${id_ServiceOrder}`
    );
    dispatch({
      type: DELETE_SERVICE_ORDER_SUCCESS,
      payload: id_ServiceOrder,
    });

    return response.data;
  } catch (error) {
    console.error("Error completo en deleteServiceOrder:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    dispatch({
      type: DELETE_SERVICE_ORDER_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    throw error;
  }
};

// Eliminar Booking
export const deleteBooking = (id_Booking) => async (dispatch) => {
  dispatch({ type: DELETE_BOOKING_REQUEST });
  try {
    // Usamos la ruta correcta según bookingRouter.js
    await axios.delete(`${import.meta.env.VITE_API_URL}/booking/id/${id_Booking}`);

    dispatch({
      type: DELETE_BOOKING_SUCCESS,
      payload: id_Booking,
    });

    // Esperamos a que se complete la eliminación antes de obtener todos los bookings
    await dispatch(getAllBookings());

    return Promise.resolve();
  } catch (error) {
    dispatch({
      type: DELETE_BOOKING_FAILURE,
      payload: error.message,
    });
    return Promise.reject(error);
  }
};


