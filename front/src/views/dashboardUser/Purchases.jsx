import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, getUserDetails, getAllServices } from '../../redux/actions/actions';
import { useAuth } from "../../firebase/AuthContext";

const Purchases = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id_User } = useAuth();
  const userDetails = useSelector((state) => state.users.userDetails);
  const orders = useSelector((state) => state.orders.ordersList);
  const services = useSelector((state) => state.excursions);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    if (id_User) {
      dispatch(getUserDetails(id_User));
      dispatch(getAllServices());
    } else {
      navigate('/login');
    }
  }, [dispatch, id_User, navigate]);

  useEffect(() => {
    if (userDetails?.id_User) {
      dispatch(getAllOrders());
    }
  }, [dispatch, userDetails]);

  // Agregamos logs para depuración
  useEffect(() => {
    if (orders && services) {
      console.log('Órdenes disponibles:', orders);
      console.log('Servicios disponibles:', services);
    }
  }, [orders, services]);

  // Filtramos las órdenes del usuario y agregamos la información del servicio
  const userOrders = orders?.filter(order => order.id_User === id_User).map(order => {
    // Verificamos la estructura de la orden
    console.log('Procesando orden completa:', order);
    console.log('Payment Information detallada:', JSON.stringify(order.paymentInformation, null, 2));
    
    // Obtenemos el ServiceId y título del primer elemento de paymentInformation
    const paymentInfo = order.paymentInformation?.[0] || {};
    console.log('Payment Info extraída:', paymentInfo);

    // Intentamos obtener el id del servicio de diferentes propiedades posibles
    const serviceId = paymentInfo.ServiceId || paymentInfo.id_Service || paymentInfo.serviceId;
    console.log('ServiceId encontrado:', serviceId);
    
    // Intentamos obtener el título de diferentes propiedades posibles
    const title = paymentInfo.serviceTitle || paymentInfo.title || paymentInfo.name;
    console.log('Título encontrado:', title);
    
    // Buscamos el servicio usando el ServiceId
    const service = services?.find(s => s.id_Service === serviceId);
    console.log('Servicio encontrado en la lista:', service);
    
    // Calculamos el total de personas
    const totalPeople = order.totalPeople || paymentInfo.totalPeople || paymentInfo.quantity || 1;
    console.log('Total de personas:', totalPeople);
    
    return {
      ...order,
      serviceTitle: title || service?.title || 'Excursión no encontrada',
      totalPeople: totalPeople,
      serviceId: serviceId
    };
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Manejamos los estados de carga y error
  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-16">
        <div className="text-center">
          <p className="text-[#4256a6] font-poppins text-lg">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 mt-16">
        <div className="text-center">
          <p className="text-red-500 font-poppins text-lg">
            Hubo un error al cargar la información. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#4256a6] text-white py-2 px-6 rounded-lg hover:bg-[#334477] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Si no hay id_User, mostramos mensaje
  if (!id_User) {
    return (
      <div className="container mx-auto p-6 mt-16">
        <div className="text-center">
          <p className="text-[#4256a6] font-poppins text-lg">
            Por favor, inicia sesión para ver tus compras.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-[#4256a6] text-white py-2 px-6 rounded-lg hover:bg-[#334477] transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }
  
const handleGoToExcursions = () => {
    setAllowHomeNavigation(true); 
    navigate("/"); 
  };
  
  return (
    <div className="container mx-auto p-6 mt-16 bg-[#f9f3e1] border-l-4 border-[#425a66] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">Mis Compras</h1>
      
      {!orders || !services ? (
        <p className="text-center text-[#4256a6]">Cargando compras...</p>
      ) : userOrders?.length > 0 ? (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <div
              key={order.id_ServiceOrder}
              className="bg-[#dac9aa] shadow-md rounded-lg p-6 border border-[#425a66] hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-3 flex-grow">
                  <h3 className="text-xl font-semibold text-[#4256a6] font-poppins">
                    {order.paymentInformation?.[0]?.title || 
                     order.paymentInformation?.[0]?.serviceTitle || 
                     'Excursión no encontrada'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-[#f9f3e1] p-3 rounded-lg">
                      <p className="font-semibold text-[#425a66]">Detalles de la Compra</p>
                      <div className="mt-1 space-y-1 text-black">
                        <p>Fecha de compra: {formatDate(order.orderDate)}</p>
                        <p>Método de pago: {order.paymentMethod || 'No especificado'}</p>
                        <p>Cantidad de personas: {order.totalPeople}</p>
                        <p className="font-medium text-[#4256a6]">
                          Total: {formatCurrency(order.total)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-[#f9f3e1] p-3 rounded-lg">
                      <p className="font-semibold text-[#425a66]">Estado del Pago</p>
                      <div className="mt-1 space-y-1">
                        <p className={`font-medium ${
                          order.paymentStatus === 'Pagado' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          Estado: {order.paymentStatus}
                        </p>
                       
                        {order.paymentInformation?.[0]?.DNI_Personal && (
                          <p className="text-black">DNI: {order.paymentInformation[0].DNI_Personal}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#4256a6] font-poppins text-lg">
            No tienes compras registradas.
          </p>
          <button
            onClick={handleGoToExcursions}
            className="mt-4 bg-[#4256a6] text-white py-2 px-6 rounded-lg hover:bg-[#334477] transition-colors"
          >
            Ver servicios disponibles
          </button>
        </div>
      )}
    </div>
  );
};

export default Purchases;
