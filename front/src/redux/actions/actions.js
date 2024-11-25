import axios from "axios";
import {
  CREATE_EXCURSION_FAILURE,
  CREATE_EXCURSION_REQUEST,
  CREATE_EXCURSION_SUCCESS,
  GET_ALL_SERVICES,
  DELETE_SERVICE,
  TOGGLE_SERVICE_STATUS_SUCCESS,
  //users
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  TOGGLE_USER_STATUS_REQUEST,
  TOGGLE_USER_STATUS_SUCCESS,
  TOGGLE_USER_STATUS_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  GET_USER_DETAILS_REQUEST,
  GET_USER_DETAILS_SUCCESS,
  GET_USER_DETAILS_FAILURE,
  GET_USER_BY_NAME_SUCCESS,
  GET_USER_BY_NAME_FAILURE,
  GET_USER_BY_DNI_REQUEST,
  GET_USER_BY_DNI_SUCCESS,
  GET_USER_BY_DNI_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from "./types";

export const createExcursion = (excursionData) => async (dispatch) => {
  dispatch({ type: CREATE_EXCURSION_REQUEST });
  try {
    const response = await axios.post(
      "http://localhost:3001/service/",
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

export const getAllServices = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:3001/service");
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
      `http://localhost:3001/service/name/${title}`
    );
    dispatch({ type: DELETE_SERVICE, payload: title });
    return response.data;
  } catch (error) {
    console.error("Error eliminando la excursión:", error);
    throw error;
  }
};

export const toggleServiceActiveStatus = (id_Service) => async (dispatch) => {
  try {
    const response = await axios.patch(
      `http://localhost:3001/service/${id_Service}/toggle`
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
  console.log("Actions - getUsers: Iniciando solicitud para obtener usuarios");
  dispatch({ type: GET_USERS_REQUEST });
  try {
    const response = await axios.get("http://localhost:3001/user");
    console.log(
      "Actions - getUsers: Usuarios obtenidos con éxito:",
      response.data
    );
    dispatch({ type: GET_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(
      "Actions - getUsers: Error al obtener usuarios:",
      error.message
    );
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
      `http://localhost:3001/user/${id_User}/active`
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
  console.log(`Actions - deleteUser: Eliminando usuario con ID: ${id_User}`);
  dispatch({ type: DELETE_USER_REQUEST }); // Inicio del proceso
  try {
    const response = await axios.delete(
      `http://localhost:3001/user/id/${id_User}`
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
      `http://localhost:3001/user/id/${id_User}`
    );
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
  console.log(`Actions - getUserByName: Buscando usuario por nombre: ${name}`);
  dispatch({ type: GET_USER_BY_NAME_REQUEST });
  try {
    const response = await axios.get(`http://localhost:3001/user/name/${name}`);
    console.log("Actions - getUserByName: Usuario encontrado:", response.data);
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
  console.log(`Actions - getUserByDni: Buscando usuario por DNI: ${dni}`);
  dispatch({ type: GET_USER_BY_DNI_REQUEST });
  try {
    const response = await axios.get(`http://localhost:3001/user/DNI/${dni}`);
    console.log("Actions - getUserByDni: Usuario encontrado:", response.data);
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
  console.log(
    `Actions - updateUserDetails: Actualizando detalles del usuario con ID: ${id_User}`
  );
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await axios.put(
      `http://localhost:3001/user/id/${id_User}`,
      updatedData
    );
    console.log(
      "Actions - updateUserDetails: Usuario actualizado con éxito:",
      response.data
    );
    dispatch({ type: UPDATE_USER_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(
      "Actions - updateUserDetails: Error al actualizar usuario:",
      error.message
    );
    dispatch({ type: UPDATE_USER_FAILURE, payload: error.message });
  }
};
