import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBookings,
  getBookingsByService,
  getAllOrders,
  deleteBooking,
} from "../../../redux/actions/actions";
import { EyeIcon, TrashIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  IconButton,
  Select,
  Option,
  Tooltip,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import ReservationModal from "../../modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = ["Excursión", "Cantidad de Reservas", "Estado", ""];

export function ReservationsTable({
  reservations: propReservations,
  onViewDetail,
}) {
  const dispatch = useDispatch();

  // Obtener id_User desde el estado global de autenticación
  const id_User = useSelector((state) => state.user?.id_User);
  const reservationsState = useSelector((state) => state.bookings);
  const ordersState = useSelector((state) => state.orders);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    if (propReservations === null) {
      dispatch(getAllBookings());
    }
  }, [dispatch, propReservations]);

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (selectedReservation && selectedReservation.id_User) {
      // No es necesario obtener las órdenes de nuevo si ya están disponibles
    }
  }, [dispatch, selectedReservation]);

  useEffect(() => {
    if (
      Array.isArray(ordersState.ordersList) &&
      ordersState.ordersList.length > 0 &&
      selectedReservation
    ) {
      if (selectedReservation.serviceOrder) {
        return;
      }

      const matchingOrder = ordersState.ordersList.find(
        (order) =>
          String(order.id_ServiceOrder) ===
          String(selectedReservation.id_ServiceOrder)
      );

      if (matchingOrder) {
        setSelectedReservation((prevState) => ({
          ...prevState,
          serviceOrder: matchingOrder,
        }));
      }
    }
  }, [ordersState.ordersList, selectedReservation]);

  useEffect(() => {
    if (selectedService || selectedDate || selectedTime) {
      dispatch(
        getBookingsByService(selectedService, selectedDate, selectedTime)
      );
    }
  }, [dispatch, selectedService, selectedDate, selectedTime]);

  const displayReservations = useMemo(() => {
    const baseReservations =
      propReservations || reservationsState.bookingsList || [];

    if (!Array.isArray(baseReservations)) {
      return [];
    }

    let filtered = baseReservations;

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
    return filtered;
  }, [
    propReservations,
    reservationsState.bookingsList,
    selectedService,
    selectedDate,
    selectedTime,
  ]);

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

  const groupedReservations = useMemo(() => {
    const reservations = displayReservations || [];
    return reservations.reduce((groups, booking) => {
      const key = booking.id_ServiceOrder;
      if (!groups[key]) {
        groups[key] = {
          serviceTitle: booking.serviceTitle,
          id_ServiceOrder: key,
          bookings: [],
          serviceOrder: ordersState.ordersList.find(
            (order) => order.id_ServiceOrder === key
          ),
        };
      }
      groups[key].bookings.push(booking);
      return groups;
    }, {});
  }, [displayReservations, ordersState.ordersList]);

  const handleEditReservation = (reservation) => {
    if (!reservation) {
      return;
    }
    const reservationsArray =
      propReservations || reservationsState.bookingsList;

    if (!reservationsArray || !Array.isArray(reservationsArray)) {
      return;
    }
    if (!ordersState.ordersList) {
      return;
    }
    const fullReservation = reservationsArray.find(
      (booking) => booking.id_Booking === reservation.id_Booking
    );

    if (!fullReservation) {
      return;
    }
    const serviceOrder = ordersState.ordersList.find(
      (order) => order.id_ServiceOrder === fullReservation.id_ServiceOrder
    );

    if (!serviceOrder) {
      return;
    }

    const reservationWithOrder = {
      ...fullReservation,
      serviceOrder,
    };

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
}

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

  const handleDeleteBooking = (id_Booking) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4256a6",
      cancelButtonColor: "#f4925b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#f9f3e1",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBooking(id_Booking))
          .then(() => {
            Swal.fire({
              title: "¡Eliminado!",
              text: "La reserva ha sido eliminada.",
              icon: "success",
              confirmButtonColor: "#4256a6",
              background: "#f9f3e1",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar la reserva.",
              icon: "error",
              confirmButtonColor: "#4256a6",
              background: "#f9f3e1",
            });
          });
      }
    });
  };

  const handleAccordionClick = (id_ServiceOrder) => {
    setOpenAccordion(
      openAccordion === id_ServiceOrder ? null : id_ServiceOrder
    );
  };

  if (reservationsState.loading || ordersState.loading) {
    return (
      <div className="text-center py-8">
        <p className="text-[#4256a6] font-poppins text-lg">
          Cargando reservas...
        </p>
      </div>
    );
  }

  if (reservationsState.error || ordersState.error) {
    return (
      <div className="text-center py-8">
        <p className="text-[#4256a6] font-poppins text-lg">
          Error: {reservationsState.error || ordersState.error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9f3e1]">
      <div className="p-4">
        {/* Contenedor de filtros con títulos */}
        <div className="flex justify-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <Typography className="mb-2 font-poppins font-medium text-[#4256a6]">
              Seleccionar Servicio
            </Typography>
            <div className="w-72">
              <Select
                value={selectedService}
                onChange={(e) => setSelectedService(e)}
                className="bg-white border border-[#425a66]/20 focus:border-[#4256a6]"
                containerProps={{ className: "min-w-[200px]" }}
                labelProps={{
                  className: "hidden", // Oculta el label flotante
                }}
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
          </div>

          <div className="flex flex-col items-center">
            <Typography className="mb-2 font-poppins font-medium text-[#4256a6]">
              Seleccionar Fecha
            </Typography>
            <div className="w-72">
              <Select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e)}
                className="bg-white border border-[#425a66]/20 focus:border-[#4256a6]"
                containerProps={{ className: "min-w-[200px]" }}
                labelProps={{
                  className: "hidden",
                }}
              >
                <Option value="">Todas las Fechas</Option>
                {availableDates.map((date) => (
                  <Option key={date} value={date}>
                    {formatDate(date)}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <Typography className="mb-2 font-poppins font-medium text-[#4256a6]">
              Seleccionar Hora
            </Typography>
            <div className="w-72">
              <Select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e)}
                className="bg-white border border-[#425a66]/20 focus:border-[#4256a6]"
                containerProps={{ className: "min-w-[200px]" }}
                labelProps={{
                  className: "hidden",
                }}
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
        </div>

        {renderActiveFilters()}
      </div>

      <div className="space-y-4">
        {Object.values(groupedReservations).map((group) => (
          <Accordion
            key={group.id_ServiceOrder}
            open={openAccordion === group.id_ServiceOrder}
            className="bg-white rounded-lg"
          >
            <AccordionHeader
              onClick={() => handleAccordionClick(group.id_ServiceOrder)}
              className="border-b-0 transition-colors hover:bg-[#dac9aa]/10 rounded-lg px-4"
            >
              <div className="w-full grid grid-cols-4 items-center">
                <Typography className="font-poppins text-[#425a66]">
                  {group.serviceTitle}
                </Typography>
                <Typography className="font-poppins text-[#425a66]">
                  {group.bookings.length} pasajeros
                  {group.serviceOrder?.paymentInformation?.[0]?.babies > 0 && (
                    <span className="text-gray-500 text-sm ml-2">
                      (+{group.serviceOrder.paymentInformation[0].babies} bebés)
                    </span>
                  )}
                </Typography>
                <Typography className="font-poppins text-[#425a66]">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      group.serviceOrder?.Bookings?.length > 0 ||
                      group.serviceOrder?.paymentStatus === "Pagado"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {group.serviceOrder?.Bookings?.length > 0
                      ? "Pagado"
                      : group.serviceOrder?.paymentStatus || "Pendiente"}
                  </span>
                </Typography>
                <div className="flex justify-end">
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform ${
                      openAccordion === group.id_ServiceOrder
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </AccordionHeader>
            <AccordionBody className="px-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Pasajero</th>
                    <th className="text-left py-2">DNI</th>
                    <th className="text-left py-2">Fecha y Hora</th>
                    <th className="text-center py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {group.bookings.map((booking) => (
                    <tr
                      key={booking.id_Booking}
                      className="hover:bg-[#dac9aa]/10 transition-colors"
                    >
                      <td className="py-2">{booking.passengerName}</td>
                      <td className="py-2">{booking.DNI}</td>
                      <td className="py-2">{booking.dateTime}</td>
                      <td className="py-2">
                        <div className="flex justify-center gap-2">
                          <Tooltip content="Ver Detalle">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                onViewDetail({
                                  ...booking,
                                  serviceOrder: group.serviceOrder,
                                })
                              }
                              className="text-[#4256a6] hover:bg-[#4256a6]/10"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Eliminar Reserva">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                handleDeleteBooking(booking.id_Booking)
                              }
                              className="text-red-500 hover:bg-red-50"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AccordionBody>
          </Accordion>
        ))}
      </div>

      {selectedReservation && (
        <ReservationModal
          isOpen={!!selectedReservation}
          onClose={() => setSelectedReservation(null)}
          reservation={selectedReservation}
          onSave={handleSaveReservation}
        />
      )}
    </div>
  );
}
