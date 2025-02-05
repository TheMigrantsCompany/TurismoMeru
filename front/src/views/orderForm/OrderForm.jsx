import React, { useState, useRef, useContext, useEffect } from "react";
import { useCart } from "../shopping-cart/CartContext";
import { useDispatch } from "react-redux";
import { createServiceOrder } from "../../redux/actions/actions";
import { AuthContext } from "../../firebase/AuthContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const OrderForm = () => {
  const dispatch = useDispatch();
  const { cartItems } = useCart();
  const formRef = useRef(null);
  const { id_User } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    paymentMethod: "",
    country: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [mercadoPago, setMercadoPago] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Inicializar el SDK de Mercado Pago solo una vez
    if (!mercadoPago && !sdkLoaded) {
      const mp = initMercadoPago("TEST-2a1e59bd-9273-4211-8a0e-95896b3bea36", {
        locale: "es-AR",
      });
      setMercadoPago(mp);
      setSdkLoaded(true);
    }
  }, [mercadoPago, sdkLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "dni",
      "paymentMethod",
      "country",
      "address",
      "city",
      "state",
      "postalCode",
      "email",
    ];
    return requiredFields.every((field) => formData[field]?.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return alert("Solicitud en proceso. Por favor, espera.");
    if (!id_User) return alert("Error: Usuario no autenticado.");
    if (!validateForm()) return alert("Por favor, completa todos los campos obligatorios.");
    if (cartItems.length === 0) return alert("El carrito está vacío.");
  
    setLoading(true);
  
    try {
      // Preparación de los datos de la orden
      const items = cartItems.map((item) => {
        console.log("Contenido del carrito:", cartItems);
        const basePrice = parseFloat(item.price || 0);
        const adults = parseInt(item.quantities?.adults || 0, 10);
        const minors = parseInt(item.quantities?.children || 0, 10);
        const seniors = parseInt(item.quantities?.seniors || 0, 10);
        const totalPeople = adults + minors + seniors;
      
        if (isNaN(basePrice) || totalPeople === 0) {
          throw new Error("Error: Hay valores inválidos en los artículos del carrito.");
        }
  
        // Aplicar descuentos
        const discountForMinors = item.discountForMinors || 0;
        const discountForSeniors = item.discountForSeniors || 0;
      
        const minorPrice = basePrice - (basePrice * discountForMinors) / 100;
        const seniorPrice = basePrice - (basePrice * discountForSeniors) / 100;
      
        const totalPrice =
          adults * basePrice + minors * minorPrice + seniors * seniorPrice;
  
          return {
            id_Service: item.id_Service,
            title: item.title || "Servicio sin título",
            description: item.description || "Sin descripción",
            totalPeople,
            unit_price: basePrice,
            currency_id: "ARS",
          };
        });
  
        const orderData = {
          orderDate: new Date().toISOString(),
          id_User,
          paymentMethod: formData.paymentMethod,
          items: cartItems.map((item) => ({
            id_Service: item.id_Service,
            date: item.selectedDate,    
            time: item.selectedTime,    
            adults: item.quantities?.adults || 0,
            minors: item.quantities?.children || 0,
            seniors: item.quantities?.seniors || 0,
          })),
          paymentStatus: "Pendiente",
        };
  
      // Enviar datos al backend
      const createdOrder = await dispatch(createServiceOrder(orderData));
      
      setOrderId(createdOrder.id_ServiceOrder);
  
      let data;
  
      // Crear preferencia de pago
      if (formData.paymentMethod === "Pagos desde Argentina") {
        const response = await fetch("http://localhost:3001/payment/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentInformation: items,
            id_User,
            DNI: formData.dni,
            email: formData.email,
            id_ServiceOrder: createdOrder.id_ServiceOrder,
            external_reference: createdOrder.id_ServiceOrder,
            metadata: {
                orderId: createdOrder.id_ServiceOrder,  
                totalPeople: items.reduce((total, item) => total + item.totalPeople, 0),  
                totalPrice: items.reduce((total, item) => total + (item.unit_price * item.totalPeople), 0),  
              }
          }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Detalles del error:", errorText);
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
  
        data = await response.json();
        console.log("Preference ID recibido:", data.preferenceId);
      }
  
      if (!data || !data.preferenceId) {
        throw new Error("No se recibió un preferenceId válido.");
      }
  
      setPreferenceId(data.preferenceId);
  
      // Esperar a que el SDK esté listo
      if (!sdkLoaded) {
        setIsReady(false);
        return alert("Error: Mercado Pago aún no está listo.");
      }
  
      setIsReady(true); // Marcar como listo para proceder con el pago
  
      // Ejecutar el flujo de pago solo si el SDK está listo
      if (isReady && mercadoPago) {
        mercadoPago.checkout({
          preference: { id: data.preferenceId },
          autoOpen: true,
        });
        alert("¡Pedido confirmado exitosamente!");
      }
    } catch (error) {
      console.error("Error en el flujo de pago:", error);
      alert("Hubo un error. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-10">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        id="orderForm"
        className="flex-1 text-gray-900 p-8 rounded-lg shadow-md border border-gray-300"
      >
        <h2 className="text-xl font-bold text-gray-700 mb-6">Detalles de Facturación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Nombre *', name: 'firstName', required: true },
            { label: 'Apellidos *', name: 'lastName', required: true },
            { label: 'Mail *', name: 'email', required: true },
            { label: 'DNI / Pasaporte *', name: 'dni', required: true }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                required={field.required}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">País / Región *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full mt-1 p-3 border text-gray-700 rounded-md"
              required
            >
              <option value="">Selecciona un país</option>
              {['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
                'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Estados Unidos'].map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Dirección de la calle *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
            required
          />
          <label className="block text-sm font-medium text-gray-700 mt-4">Apartamento</label>
          <input
            type="text"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            { label: 'Ciudad *', name: 'city', required: true },
            { label: 'Región / Provincia *', name: 'state', required: true },
            { label: 'Código Postal *', name: 'postalCode', required: true }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                required={field.required}
              />
            </div>
          ))}
        </div>
      </form>
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2 mb-4">
          Resumen de la Orden
        </h2>
        <div className="space-y-4">
          {cartItems.map((item, index) => {
            const adultsTotal = (item.quantities?.adults || 0) * item.price;
            const childrenTotal = (item.quantities?.children || 0) * item.price * ((100 - (item.discountForMinors || 0)) / 100);
            const seniorsTotal = (item.quantities?.seniors || 0) * item.price * ((100 - (item.discountForSeniors || 0)) / 100);

            const totalItemPrice = adultsTotal + childrenTotal + seniorsTotal;

            return (
              <div
                key={`order-item-${item.id_Service}-${index}`}
                className="p-4 border rounded-md shadow-sm text-gray-900"
              >
                <p className="text-lg font-medium">{item.title}</p>
                {item.quantities?.adults > 0 && (
                  <p className="text-sm text-gray-900">
                    Adultos: {item.quantities?.adults} x ${item.price.toLocaleString()} = ${adultsTotal.toFixed(2)}
                  </p>
                )}
                {item.quantities?.children > 0 && (
                  <p className="text-sm text-gray-900">
                    Menores: {item.quantities?.children} x ${(
                      item.price * ((100 - (item.discountForMinors || 0)) / 100)
                    ).toFixed(2)} = ${childrenTotal.toFixed(2)}
                  </p>
                )}
                {item.quantities?.seniors > 0 && (
                  <p className="text-sm text-gray-900">
                    Jubilados: {item.quantities?.seniors} x ${(
                      item.price * ((100 - (item.discountForSeniors || 0)) / 100)
                    ).toFixed(2)} = ${seniorsTotal.toFixed(2)}
                  </p>
                )}
                <p className="text-xs text-gray-900">
                  Fecha: {item.selectedDate || 'Fecha no seleccionada'}
                </p>
                <p className="text-xs text-gray-900">
                  Hora: {item.selectedTime || 'Hora no seleccionada'}
                </p>
              </div>
            );
          })}
          <div className="flex justify-between text-gray-900 text-lg font-semibold mt-4">
            <p>Subtotal</p>
            <p>
              ${cartItems
                .reduce((acc, item) => {
                  const totalItemPrice =
                    (item.quantities?.adults * item.price) +
                    (item.quantities?.children * item.price * ((100 - (item.discountForMinors || 0)) / 100)) +
                    (item.quantities?.seniors * item.price * ((100 - (item.discountForSeniors || 0)) / 100)) +
                    (item.additionalEquipment ? item.additionalEquipmentPrice || 0 : 0);
                  return acc + totalItemPrice;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between text-gray-900 text-xl font-bold mt-4">
            <p>Total</p>
            <p>
              ${cartItems
                .reduce((acc, item) => {
                  const totalItemPrice =
                    (item.quantities?.adults * item.price) +
                    (item.quantities?.children * item.price * ((100 - (item.discountForMinors || 0)) / 100)) +
                    (item.quantities?.seniors * item.price * ((100 - (item.discountForSeniors || 0)) / 100)) +
                    (item.additionalEquipment ? item.additionalEquipmentPrice || 0 : 0);
                  return acc + totalItemPrice;
                }, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">Método de Pago</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona un método</option>
            <option value="Pagos desde Argentina">Pagos desde Argentina</option>
            <option value="Pagos desde el exterior">Pagos desde el exterior</option>
          </select>
        </div>
        {formData.paymentMethod === "Pagos desde Argentina" && preferenceId && (
          <Wallet initialization={{ preferenceId }} />
        )}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
