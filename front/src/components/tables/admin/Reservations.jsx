import {
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { PencilIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Tooltip,
    IconButton,
  } from "@material-tailwind/react";
  import Swal from "sweetalert2";
  
  // Tabs para diferentes estados de la reserva
  const TABS = [
    { label: "Todas", value: "all" },
    { label: "Aceptadas", value: "accepted" },
    { label: "Pendientes", value: "pending" },
    { label: "Canceladas", value: "cancelled" },
  ];
  
  // Encabezados de la tabla
  const TABLE_HEAD = ["Cliente", "Excursión", "Cantidad de Personas", "Estado", "Fecha de Excursión", ""];
  
  // Datos de ejemplo
  const TABLE_ROWS = [
    {
      name: "Juan Pérez",
      excursion: "Excursión Glaciar",
      people: 4,
      status: "accepted",
      date: "12/10/2024",
    },
    {
      name: "María López",
      excursion: "Tour de Ballenas",
      people: 2,
      status: "pending",
      date: "25/11/2024",
    },
    // Agrega más reservas aquí
  ];
  
  // Función para el manejo del modal de edición de reservas
  const handleEditReservation = (reservation) => {
    // Lógica para abrir el modal y editar la reserva
    console.log("Editando reserva:", reservation);
  };
  
  // Función para SweetAlert al modificar reserva
  const handleSuccessAlert = () => {
    Swal.fire({
      title: "¡Reserva modificada!",
      text: "La reserva fue actualizada exitosamente.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };
  
  export function ReservationsTable() {
    return (
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Gestión de Reservas
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Consulta y administra todas las reservas.
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          </div>
        </CardHeader>
  
        {/* Quita overflow-scroll y ajusta los estilos */}
        <CardBody className="px-0">
          <table className="mt-4 w-full table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {TABLE_ROWS.map(
                ({ name, excursion, people, status, date }, index) => {
                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
  
                  return (
                    <tr key={name}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {name}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {excursion}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {people}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={status}
                          color={status === "accepted" ? "green" : status === "pending" ? "yellow" : "red"}
                        />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {date}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Editar Reserva">
                          <IconButton variant="text" onClick={() => handleEditReservation({ name, excursion, people, status, date })}>
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
        </CardBody>
        
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Página 1 de 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Anterior
            </Button>
            <Button variant="outlined" size="sm">
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
  