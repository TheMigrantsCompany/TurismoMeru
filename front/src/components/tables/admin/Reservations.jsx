import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings, getBookingsByService, getAllOrders } from "../../../redux/actions/actions";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import ReservationModal from "../../../components/modals/admin-modal/ReservationModal";
import Swal from "sweetalert2";

const TABLE_HEAD = ["Cliente", "Excursión", "Cantidad de pasajeros por reserva", "Fecha y Hora", ""];

export function ReservationsTable() {
  const dispatch = useDispatch();

  // Obtener id_User desde el estado global de autenticación
  const id_User = useSelector((state) => state.user?.id_User);
  const reservationsState = useSelector((state) => state.bookings);
  const ordersState = useSelector((state) => state.orders);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Obtener todas las reservas
  useEffect(() => {
    console.log("Cargando todas las reservas...");
    dispatch(getAllBookings());
  }, [dispatch]);

  // Obtener todas las órdenes desde el principio (si no se obtienen de otra manera)
  useEffect(() => {
    console.log("Obteniendo todas las órdenes...");
    dispatch(getAllOrders());
  }, [dispatch]);

  // Obtener las órdenes solo cuando se selecciona una reserva
  useEffect(() => {
    if (selectedReservation && selectedReservation.id_User) {
      console.log("Obteniendo órdenes del usuario con ID:", selectedReservation.id_User);
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
        (order) => String(order.id_ServiceOrder) === String(selectedReservation.id_ServiceOrder)
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
      dispatch(getBookingsByService(selectedService, selectedDate, selectedTime));
    }
  }, [dispatch, selectedService, selectedDate, selectedTime]);

  const filteredReservations = useMemo(() => {
    if (!Array.isArray(reservationsState.bookingsList)) {
      console.error("filteredReservations no es un array:", reservationsState);
      return [];
    }

    let filtered = reservationsState.bookingsList;

    if (selectedService) {
      filtered = filtered.filter((booking) => booking.id_Service === selectedService);
    }

    if (selectedDate) {
      filtered = filtered.filter((booking) => booking.dateTime.includes(selectedDate));
    }

    if (selectedTime) {
      filtered = filtered.filter((booking) => booking.dateTime.includes(selectedTime));
    }

    return filtered;
  }, [reservationsState.bookingsList, selectedService, selectedDate, selectedTime]);

  const availableDates = useMemo(() => {
    if (!selectedService) return [];
    return Array.from(
      new Set(
        reservationsState.bookingsList
          .filter((reservation) => reservation.id_Service === selectedService)
          .map((reservation) => reservation.dateTime.split(" ")[0])
      )
    );
  }, [reservationsState.bookingsList, selectedService]);

  const availableTimes = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return Array.from(
      new Set(
        reservationsState.bookingsList
          .filter(
            (reservation) =>
              reservation.id_Service === selectedService && reservation.dateTime.includes(selectedDate)
          )
          .map((reservation) => reservation.dateTime.split(" ")[1])
      )
    );
  }, [reservationsState.bookingsList, selectedService, selectedDate]);

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
      (order) => String(order.id_ServiceOrder) === String(reservation.id_ServiceOrder)
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

  if (reservationsState.loading || ordersState.loading) {
    return <div>Loading...</div>;
  }

  if (reservationsState.error || ordersState.error) {
    return <div>Error: {reservationsState.error || ordersState.error}</div>;
  }

  return (
    <Card className="h-full w-full mt-16 bg-[#f9f3e1] shadow-lg rounded-lg">
      <CardBody className="p-6">
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          <Select label="Seleccionar Servicio" value={selectedService} onChange={(e) => setSelectedService(e)}>
            <Option value="">Todos los Servicios</Option>
            {Array.from(new Set(reservationsState.bookingsList.map((reservation) => reservation.id_Service))).map(
              (serviceId) => {
                const service = reservationsState.bookingsList.find(
                  (reservation) => reservation.id_Service === serviceId
                );
                return (
                  <Option key={serviceId} value={serviceId}>
                    {service?.serviceTitle}
                  </Option>
                );
              }
            )}
          </Select>

          <Select label="Seleccionar Fecha" value={selectedDate} onChange={(e) => setSelectedDate(e)}>
            <Option value="">Todas las Fechas</Option>
            {availableDates.map((date) => (
              <Option key={date} value={date}>
                {date}
              </Option>
            ))}
          </Select>

          <Select label="Seleccionar Hora" value={selectedTime} onChange={(e) => setSelectedTime(e)}>
            <Option value="">Todas las Horas</Option>
            {availableTimes.map((time) => (
              <Option key={time} value={time}>
                {time}
              </Option>
            ))}
          </Select>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="mt-4 w-full table-auto text-center">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="p-4 border-y border-[#4256a6] bg-[#f0f5fc] text-center">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr
                  key={reservation.id_Booking}
                  className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]"
                >
                  <td className="p-4 border-b border-[#4256a6] text-center">{reservation.passengerName}</td>
                  <td className="p-4 border-b border-[#4256a6] text-center">{reservation.serviceTitle}</td>
                  <td className="p-4 border-b border-[#4256a6] text-center">{reservation.totalPeople}</td>
                  <td className="p-4 border-b border-[#4256a6] text-center">{reservation.dateTime}</td>
                  <td className="p-4 border-b border-[#4256a6] text-center">
                    <Tooltip content="Editar">
                      <IconButton size="sm" color="blue" onClick={() => handleEditReservation(reservation)}>
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
