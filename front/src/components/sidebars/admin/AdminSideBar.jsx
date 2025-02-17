import { NavLink } from "react-router-dom";
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
  const menuItems = [
    {
      path: "/admin/reservas",
      icon: CalendarIcon,
      text: "Gestión de Reservas",
    },
    {
      path: "/admin/usuarios",
      icon: UserGroupIcon,
      text: "Gestión de Usuarios",
    },
    {
      path: "/admin/excursiones",
      icon: GlobeAltIcon,
      text: "Gestión de Excursiones",
    },
    {
      path: "/admin/reviews",
      icon: StarIcon,
      text: "Gestión de Reviews",
    },
    {
      path: "/admin/ordenes",
      icon: ClipboardDocumentCheckIcon,
      text: "Gestión de Órdenes de Servicio",
    },
  ];

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-[#425a66]/5 bg-[#f9f3e1]">
      <div className="mb-2 p-4">
        <Typography
          variant="h5"
          color="blue-gray"
          className="text-[#4256a6] font-semibold text-2xl font-poppins"
        >
          Panel de Control
        </Typography>
      </div>
      <List>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block ${
                isActive
                  ? "bg-[#e0d7c6] text-white border-l-4 border-[#425a66]"
                  : "text-[#4256a6]"
              }`
            }
          >
            <ListItem className="cursor-pointer hover:bg-[#e0d7c6] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins">
              <ListItemPrefix>
                <item.icon className="h-5 w-5" />
              </ListItemPrefix>
              {item.text}
            </ListItem>
          </NavLink>
        ))}
      </List>
    </Card>
  );
}
