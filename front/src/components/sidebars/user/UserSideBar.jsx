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
  CalendarIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export function UserSideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleContactClick = () => {
    window.open('https://wa.me/+541169084059?text=Hola, necesito ayuda con mi cuenta.', '_blank');
  };

  const menuItems = [
    {
      title: "Mi Perfil",
      path: "/user/profile",
      icon: UserIcon,
    },
    {
      title: "Reviews",
      path: "/user/reviews",
      icon: StarIcon,
    },
    {
      title: "Mis Compras",
      path: "/user/compras",
      icon: ShoppingBagIcon,
    },
    {
      title: "Mis Reservas",
      path: "/user/reservas",
      icon: CalendarIcon,
    },
  ];

  return (
    <Card className="min-h-screen w-full max-w-[20rem] p-6 shadow-lg bg-[#f9f3e1] border-r border-[#425a66]/10">
      <div className="mb-10 p-4">
        <Typography variant="h4" className="text-[#4256a6] font-semibold font-poppins">
          Panel de Usuario
        </Typography>
        <Typography className="text-[#425a66] mt-2 font-poppins text-base">
          Gestiona tu cuenta y actividades
        </Typography>
      </div>
      
      <List className="space-y-3">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem
              onClick={() => navigate(item.path)}
              className={`${
                isActiveRoute(item.path)
                  ? "bg-[#4256a6] text-white shadow-md"
                  : "text-[#425a66] hover:bg-[#dac9aa]/20"
              } cursor-pointer transition-all duration-300 rounded-lg font-poppins text-lg py-4`}
            >
              <ListItemPrefix>
                <item.icon className={`h-6 w-6 ${
                  isActiveRoute(item.path)
                    ? "text-white"
                    : "text-[#4256a6]"
                }`} />
              </ListItemPrefix>
              {item.title}
            </ListItem>
          </motion.div>
        ))}
      </List>

      <div className="mt-auto pt-8 px-4">
        <motion.div 
          className="p-4 bg-[#dac9aa]/20 rounded-lg hover:bg-[#dac9aa]/30 transition-all duration-300 cursor-pointer"
          onClick={handleContactClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Typography className="text-[#425a66] font-poppins text-center text-base">
            ¿Necesitas ayuda?
          </Typography>
          <div className="flex items-center justify-center gap-2 mt-2">
            <img
              src="https://img.icons8.com/fluent/24/000000/whatsapp.png"
              alt="WhatsApp"
              className="w-5 h-5"
            />
            <Typography className="text-[#4256a6] font-poppins text-base font-medium">
              Contáctanos
            </Typography>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}
