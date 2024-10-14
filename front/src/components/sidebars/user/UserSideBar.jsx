import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import {
  UserIcon,
  StarIcon,
  ShoppingBagIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

export function UserSideBar() {
  const navigate = useNavigate(); // Define navigate

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      <List>
        <ListItem
          onClick={() => navigate("/user/profile")} // Redirige al formulario de perfil
          className="cursor-pointer"
        >
          <ListItemPrefix>
            <UserIcon className="h-5 w-5" />
          </ListItemPrefix>
          Mi Perfil
        </ListItem>
        <ListItem
          onClick={() => navigate("/user/reviews")} // Redirige a la vista de reviews
          className="cursor-pointer"
        >
          <ListItemPrefix>
            <StarIcon className="h-5 w-5" />
          </ListItemPrefix>
          Reviews
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          Mis Compras
          <ListItemSuffix></ListItemSuffix>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}