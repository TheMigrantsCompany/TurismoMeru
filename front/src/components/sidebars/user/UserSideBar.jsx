import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserIcon,
  StarIcon,
  ShoppingBagIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom"; 

export function UserSideBar() {
  const navigate = useNavigate(); 

  return (
    <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-6 shadow-lg bg-[#f9f3e1] border-l-4 border-[#425a66]">
      <div className="mb-4 p-4">
        <Typography variant="h5" color="blue-gray" className="text-[#4256a6] font-semibold text-2xl font-poppins">
          Sidebar
        </Typography>
      </div>
      <List>
        <ListItem
          onClick={() => navigate("/user/profile")} 
          className="cursor-pointer text-[#4256a6] hover:bg-[#dac9aa] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <UserIcon className="h-6 w-6 text-[#4256a6]" />
          </ListItemPrefix>
          Mi Perfil
        </ListItem>
        <ListItem
          onClick={() => navigate("/user/reviews")} // Redirige a la vista de reviews
          className="cursor-pointer text-[#4256a6] hover:bg-[#dac9aa] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <StarIcon className="h-6 w-6 text-[#4256a6]" />
          </ListItemPrefix>
          Reviews
        </ListItem>
        <ListItem
          onClick={() => navigate("/user/compras")} 
          className="cursor-pointer text-[#4256a6] hover:bg-[#dac9aa] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <ShoppingBagIcon className="h-6 w-6 text-[#4256a6]" />
          </ListItemPrefix>
          Mis Compras
        </ListItem>
        <ListItem
          className="cursor-pointer text-[#4256a6] hover:bg-[#dac9aa] hover:text-white hover:border-l-4 hover:border-[#425a66] transition-all duration-200 py-3 text-lg font-poppins"
        >
          <ListItemPrefix>
            <PowerIcon className="h-6 w-6 text-[#4256a6]" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
    </Card>
  );
}
