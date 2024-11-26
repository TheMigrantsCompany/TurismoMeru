import React, { useState } from 'react';
import { useCart } from '../shopping-cart/CartContext';

const OrderForm = () => {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: '',
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.totalPrice || item.price * (item.quantities?.adults || 1)),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Procesando pago con los datos:', formData);
    console.log('Datos del carrito:', cartItems);
    // Lógica para enviar datos al backend
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 mt-12">
      {/* Formulario de orden */}
      <form className="flex-1 space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold  text-gray-900 border-b pb-2">
          Información Personal
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium  text-gray-900 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingrese su nombre"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium  text-gray-900 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese su correo electrónico"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium  text-gray-900 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ingrese su dirección"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </form>

      {/* Resumen del pedido */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold  text-gray-900 border-b pb-2 mb-4">
          Resumen de la Orden
        </h2>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`order-item-${item.id_Service}-${index}`}
              className="p-4 border rounded-md shadow-sm bg-gray-50"
            >
              <p className="text-lg font-medium">{item.title}</p>
              <p className="text-sm  text-gray-900">
                {item.quantities?.adults || 1} x ${item.price.toLocaleString()}
              </p>
              <p className="text-xs  text-gray-900">
                Fecha: {item.selectedDate || 'Fecha no seleccionada'}
              </p>
              <p className="text-xs  text-gray-900">
                Hora: {item.selectedTime || 'Hora no seleccionada'}
              </p>
            </div>
          ))}
          <div className="flex justify-between text-gray-900 text-lg font-semibold mt-4">
            <p>Subtotal</p>
            <p>${subtotal.toLocaleString()}</p>
          </div>
          <div className="flex justify-between text-gray-900 text-xl font-bold mt-4">
            <p>Total</p>
            <p>${subtotal.toLocaleString()}</p>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium  text-gray-900 mb-1">Método de Pago</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-3 border  text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un método</option>
              <option value="transfer">Transferencia Bancaria</option>
              <option value="paypal">PayPal</option>
              <option value="creditCard">Tarjeta de Crédito</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600  text-gray-900 py-3 rounded-md font-semibold shadow-md hover:bg-blue-700 transition duration-300 mt-6"
          >
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
