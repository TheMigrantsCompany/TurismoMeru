import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  getBookingsByService,
  getAllOrders,
} from "../../../redux/actions/actions";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardBody,
  Typography,
  IconButton,
  Select,
  Option,
  Tooltip,
} from "@material-tailwind/react";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = [
  "Cliente",
  "Excursión",
  "Cantidad de pasajeros",
  "Fecha y Hora",
  "",
];

export function ReservationsTable({ reservations: propReservations, onEdit }) {
  const dispatch = useDispatch();

  // Obtener id_User desde el estado global de autenticación
  const id_User = useSelector((state) => state.user?.id_User);
  const reservationsState = useSelector((state) => state.bookings);
  const ordersState = useSelector((state) => state.orders);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Obtener todas las reservas solo si no hay búsqueda activa
  useEffect(() => {
    if (propReservations === null) {
      console.log("Cargando todas las reservas...");
      dispatch(getAllBookings());
    }
  }, [dispatch, propReservations]);

  // Obtener todas las órdenes desde el principio (si no se obtienen de otra manera)
  useEffect(() => {
    console.log("Obteniendo todas las órdenes...");
    dispatch(getAllOrders());
  }, [dispatch]);

  // Obtener las órdenes solo cuando se selecciona una reserva
  useEffect(() => {
    if (selectedReservation && selectedReservation.id_User) {
      console.log(
        "Obteniendo órdenes del usuario con ID:",
        selectedReservation.id_User
      );
      // No es necesario obtener las órdenes de nuevo si ya están disponibles
    }
  }, [dispatch, selectedReservation]);

  // Buscar la orden correspondiente a la reserva seleccionada
  useEffect(() => {
    if (
      Array.isArray(ordersState.ordersList) &&
      ordersState.ordersList.length > 0 &&
      selectedReservation
    ) {
      console.log("Órdenes disponibles:", ordersState.ordersList);

      // Verifica si ya está asociada la orden con la reserva
      if (selectedReservation.serviceOrder) {
        return; // No hacer nada si la reserva ya tiene una orden asociada
      }

      // Buscar la orden correspondiente
      const matchingOrder = ordersState.ordersList.find(
        (order) =>
          String(order.id_ServiceOrder) ===
          String(selectedReservation.id_ServiceOrder)
      );

      if (matchingOrder) {
        console.log("Orden encontrada:", matchingOrder);
        setSelectedReservation((prevState) => ({
          ...prevState,
          serviceOrder: matchingOrder,
        }));
      } else {
        console.log("No se encontró una orden para esta reserva.");
      }
    } else if (selectedReservation) {
      console.log("Órdenes aún no disponibles o lista vacía.");
    }
  }, [ordersState.ordersList, selectedReservation]);

  // Cargar reservas filtradas por servicio, fecha o hora
  useEffect(() => {
    if (selectedService || selectedDate || selectedTime) {
      console.log(
        `Filtrando reservas con servicio: ${selectedService}, fecha: ${selectedDate}, hora: ${selectedTime}`
      );
      dispatch(
        getBookingsByService(selectedService, selectedDate, selectedTime)
      );
    }
  }, [dispatch, selectedService, selectedDate, selectedTime]);

  // Determinar qué reservas mostrar y aplicar filtros
  const displayReservations = useMemo(() => {
    // Si hay resultados de búsqueda, usar esos
    const baseReservations =
      propReservations || reservationsState.bookingsList || [];

    if (!Array.isArray(baseReservations)) {
      return [];
    }

    let filtered = baseReservations;

    // Aplicar filtros solo si no hay una búsqueda activa
    if (!propReservations) {
      if (selectedService) {
        filtered = filtered.filter(
          (booking) => booking.id_Service === selectedService
        );
      }

      if (selectedDate) {
        filtered = filtered.filter((booking) =>
          booking.dateTime.includes(selectedDate)
        );
      }

      if (selectedTime) {
        filtered = filtered.filter((booking) =>
          booking.dateTime.includes(selectedTime)
        );
      }

      // Mostrar mensaje si no hay resultados después de aplicar los filtros
      if (
        filtered.length === 0 &&
        (selectedService || selectedDate || selectedTime)
      ) {
        Swal.fire({
          title: "Sin resultados",
          text: "No se encontraron reservas con los filtros seleccionados.",
          icon: "info",
          confirmButtonText: "OK",
          background: "#f9f3e1",
          confirmButtonColor: "#4256a6",
        });
      }
    }

    console.log("Reservas filtradas:", filtered);
    return filtered;
  }, [
    propReservations,
    reservationsState.bookingsList,
    selectedService,
    selectedDate,
    selectedTime,
  ]);

  // Calcular fechas disponibles basadas en el servicio seleccionado
  const availableDates = useMemo(() => {
    const reservations =
      propReservations || reservationsState.bookingsList || [];
    if (!selectedService || !Array.isArray(reservations)) return [];

    return Array.from(
      new Set(
        reservations
          .filter((reservation) => reservation.id_Service === selectedService)
          .map((reservation) => reservation.dateTime.split(" ")[0])
      )
    );
  }, [propReservations, reservationsState.bookingsList, selectedService]);

  // Calcular horas disponibles basadas en el servicio y fecha seleccionados
  const availableTimes = useMemo(() => {
    const reservations =
      propReservations || reservationsState.bookingsList || [];
    if (!selectedService || !selectedDate || !Array.isArray(reservations))
      return [];

    return Array.from(
      new Set(
        reservations
          .filter(
            (reservation) =>
              reservation.id_Service === selectedService &&
              reservation.dateTime.includes(selectedDate)
          )
          .map((reservation) => reservation.dateTime.split(" ")[1])
      )
    );
  }, [
    propReservations,
    reservationsState.bookingsList,
    selectedService,
    selectedDate,
  ]);

  const handleEditReservation = (reservation) => {
    console.log("Reserva seleccionada para editar:", reservation);
    console.log("Órdenes disponibles:", ordersState.ordersList);

    // Verificar si id_ServiceOrder está presente en la reserva
    if (!reservation.id_ServiceOrder) {
      console.warn("No se ha encontrado id_ServiceOrder en la reserva.");
      return;
    }

    // Buscar la orden que corresponde al id_ServiceOrder de la reserva
    const serviceOrder = ordersState.ordersList.find(
      (order) =>
        String(order.id_ServiceOrder) === String(reservation.id_ServiceOrder)
    );

    if (!serviceOrder) {
      console.warn("No se encontró una orden para esta reserva.");
    }

    const reservationWithOrder = { ...reservation, serviceOrder };
    setSelectedReservation(reservationWithOrder);
  };

  const handleSaveReservation = () => {
    Swal.fire({
      title: "¡Reserva modificada!",
      text: "La reserva fue actualizada exitosamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const handleResetFilters = () => {
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
  };

  // Función para obtener el título del servicio
  const getServiceTitle = (serviceId) => {
    const service = reservationsState.bookingsList?.find(
      (booking) => booking.id_Service === serviceId
    );
    return service?.serviceTitle || serviceId;
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Función para mostrar los filtros activos
  const renderActiveFilters = () => {
    const activeFilters = [];

    if (selectedService) {
      activeFilters.push(`Servicio: ${getServiceTitle(selectedService)}`);
    }
    if (selectedDate) {
      activeFilters.push(`Fecha: ${formatDate(selectedDate)}`);
    }
    if (selectedTime) {
      activeFilters.push(`Hora: ${selectedTime}`);
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Filtros activos:
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Limpiar filtros
          </button>
        </div>
      </div>
    );
  };

  if (reservationsState.loading || ordersState.loading) {
    return <div>Loading...</div>;
  }

  if (reservationsState.error || ordersState.error) {
    return <div>Error: {reservationsState.error || ordersState.error}</div>;
  }

  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
      <CardBody className="p-6">
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="w-72">
              <Select
                label="Seleccionar Servicio"
                value={selectedService}
                onChange={(e) => setSelectedService(e)}
                className="bg-white"
                containerProps={{ className: "min-w-[200px]" }}
              >
                <Option value="">Todos los Servicios</Option>
                {Array.from(
                  new Set(
                    reservationsState.bookingsList?.map(
                      (reservation) => reservation.id_Service
                    ) || []
                  )
                ).map((serviceId) => (
                  <Option key={serviceId} value={serviceId}>
                    {getServiceTitle(serviceId)}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="w-72">
              <Select
                label="Seleccionar Fecha"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e)}
                className="bg-white"
                containerProps={{ className: "min-w-[200px]" }}
              >
                <Option value="">Todas las Fechas</Option>
                {availableDates.map((date) => (
                  <Option key={date} value={date}>
                    {formatDate(date)}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="w-72">
              <Select
                label="Seleccionar Hora"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e)}
                className="bg-white"
                containerProps={{ className: "min-w-[200px]" }}
              >
                <Option value="">Todas las Horas</Option>
                {availableTimes.map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Mostrar filtros activos */}
          {renderActiveFilters()}
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          {displayReservations.length > 0 ? (
            <table className="mt-4 w-full table-auto text-center">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayReservations.map(
                  (
                    {
                      id_Booking,
                      id_User,
                      id_Service,
                      dateTime,
                      totalPeople,
                      passengerName,
                    },
                    index
                  ) => {
                    const isLast = index === displayReservations.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={id_Booking}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {passengerName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {getServiceTitle(id_Service)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {totalPeople}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {dateTime}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Editar Reserva">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                handleEditReservation({
                                  id_Booking,
                                  id_User,
                                  id_Service,
                                  dateTime,
                                  totalPeople,
                                  passengerName,
                                })
                              }
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 text-gray-600">
              No se encontraron reservas para mostrar
            </div>
          )}
        </div>
      </CardBody>

      {/* Modal */}
      {selectedReservation && (
        <ReservationModal
          reservation={selectedReservation}
          onSave={handleSaveReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </Card>
  );
}
