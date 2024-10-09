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
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Panel de Control
        </Typography>
      </div>
      <List>
        <ListItem onClick={() => navigate("/admin/reservas")}> {/* Uso de navigate */}
          <ListItemPrefix>
            <CalendarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Gestión de Reservas
        </ListItem>
        <ListItem onClick={() => navigate("/admin/usuarios")}> {/* Uso de navigate */}
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5" />
          </ListItemPrefix>
          Gestión de Usuarios
        </ListItem>
        <ListItem onClick={() => navigate("/admin/excursiones")}> {/* Uso de navigate */}
          <ListItemPrefix>
            <GlobeAltIcon className="h-5 w-5" />
          </ListItemPrefix>
          Gestión de Excursiones
        </ListItem>
        <ListItem onClick={() => navigate("/admin/reviews")}> {/* Uso de navigate */}
          <ListItemPrefix>
            <StarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Gestión de Reviews
        </ListItem>
        <ListItem onClick={() => navigate("/admin/ordenes")}> {/* Uso de navigate */}
          <ListItemPrefix>
            <ClipboardDocumentCheckIcon className="h-5 w-5" />
          </ListItemPrefix>
          Gestión de Órdenes de Servicio
        </ListItem>
      </List>
    </Card>
  );
}