import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Outlet } from 'react-router-dom';
import { UserSideBar } from '../../components/sidebars/user/UserSideBar';
import { getUserDetails, getAllOrders } from '../../redux/actions/actions';
import { useAuth } from "../../firebase/AuthContext";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

const DashboardSummary = () => {
  const { userDetails } = useSelector((state) => state.users);
  const orders = useSelector((state) => state.orders.ordersList);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      const userOrders = orders
        .filter(order => order.id_User === userDetails?.id_User)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 3);
      setRecentOrders(userOrders);
    }
  }, [orders, userDetails]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Typography variant="h3" className="text-[#4256a6] mb-2">
          ¡Bienvenida/o, {userDetails?.name}!
        </Typography>
        <Typography className="text-[#425a66]">
          Aquí tienes un resumen de tu actividad reciente
        </Typography>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Información del perfil mejorada */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={userDetails?.image || "https://via.placeholder.com/50"}
              alt="Perfil"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#4256a6]"
            />
            <div>
              <Typography variant="h6" className="text-[#4256a6]">
                Tu Perfil
              </Typography>
              <Typography className="text-[#425a66] text-sm">
                {userDetails?.email}
              </Typography>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="bg-[#dac9aa]/20 p-3 rounded-lg">
              <Typography className="text-sm font-medium text-[#4256a6]">
                Teléfono
              </Typography>
              <Typography className="text-[#425a66] text-sm">
                {userDetails?.phone || "No especificado"}
              </Typography>
            </div>
            
            <div className="bg-[#dac9aa]/20 p-3 rounded-lg">
              <Typography className="text-sm font-medium text-[#4256a6]">
                Ubicación
              </Typography>
              <Typography className="text-[#425a66] text-sm">
                {userDetails?.address || "No especificada"}
              </Typography>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <a
              href="/user/profile"
              className="text-[#4256a6] hover:text-[#2a3875] text-sm font-medium flex items-center"
            >
              Editar perfil
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Compras recientes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[#f9f3e1] p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-2"
        >
          <Typography variant="h6" className="text-[#4256a6] mb-4">
            Tus últimas compras
          </Typography>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id_ServiceOrder}
                  className="bg-[#dac9aa]/20 p-4 rounded-lg hover:bg-[#dac9aa]/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Typography className="font-medium text-[#4256a6]">
                        {order.paymentInformation?.[0]?.serviceTitle || order.paymentInformation?.[0]?.title || 'Excursión sin nombre'}
                      </Typography>
                      <div className="flex items-center space-x-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#425a66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <Typography className="text-sm text-[#425a66]">
                          {formatDate(order.orderDate)}
                        </Typography>
                      </div>
                      <Typography className="text-sm text-[#425a66] mt-1">
                        Personas: {order.totalPeople || order.paymentInformation?.[0]?.quantity || 1}
                      </Typography>
                    </div>
                    <Typography className="font-medium text-[#4256a6]">
                      {formatCurrency(order.total)}
                    </Typography>
                  </div>
                </div>
              ))}
              <a
                href="/user/compras"
                className=" text-[#4256a6] hover:text-[#2a3875] text-sm font-medium mt-4 flex items-center justify-end"
              >
                Ver todas tus compras
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ) : (
            <Typography className="text-[#425a66] text-center italic">
              Aún no tienes compras realizadas
            </Typography>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export function DashboardUser() {
  const dispatch = useDispatch();
  const { id_User } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (id_User) {
      dispatch(getUserDetails(id_User));
      dispatch(getAllOrders());
    }
  }, [dispatch, id_User]);

  return (
    <div className="flex min-h-screen bg-[#dac9aa]">
      <UserSideBar />
      <div className="flex-1">
        {location.pathname === '/user' ? (
          <DashboardSummary />
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

