import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserGroupIcon,
  GlobeAltIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";


export function AdminSideBar() {
  const navigate = useNavigate(); // Hook para navegar programáticamente

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-[#425a66]/5 bg-[#f9f3e1]">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray" className="text-[#4256a6] font-semibold text-2xl font-poppins">
          Panel de Control
        </Typography>
      </div>
      <List>
        <ListItem
          onClick={() => navigate("/admin/reservas")}
          className="cursor-pointer text-[#4256a6] hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <CalendarIcon className="h-5 w-5 text-[#4256a6]" />
          </ListItemPrefix>
          Gestión de Reservas
        </ListItem>
        <ListItem
          onClick={() => navigate("/admin/usuarios")}
          className="cursor-pointer text-[#4256a6] hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5 text-[#4256a6]" />
          </ListItemPrefix>
          Gestión de Usuarios
        </ListItem>
        <ListItem
          onClick={() => navigate("/admin/excursiones")}
          className="cursor-pointer text-[#4256a6] hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <GlobeAltIcon className="h-5 w-5 text-[#4256a6]" />
          </ListItemPrefix>
          Gestión de Excursiones
        </ListItem>
        <ListItem
          onClick={() => navigate("/admin/reviews")}
          className="cursor-pointer text-[#4256a6] hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <StarIcon className="h-5 w-5 text-[#4256a6]" />
          </ListItemPrefix>
          Gestión de Reviews
        </ListItem>
        <ListItem
          onClick={() => navigate("/admin/ordenes")}
          className="cursor-pointer text-[#4256a6] hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-[#4256a6]" />
          </ListItemPrefix>
          Gestión de Órdenes de Servicio
        </ListItem>
      </List>
    </Card>
  );
}