import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../shopping-cart/CartContext';
import { useDispatch, useSelector } from 'react-redux';
import { createServiceOrder, getUserDetails } from '../../redux/actions/actions';
import { useNavigate } from 'react-router-dom';

const OrderForm = () => {
    const dispatch = useDispatch();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        paymentMethod: '',
        country: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
    });

    // Estado de carga y errores
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state) => state.auth?.userData);
    const userDetails = useSelector((state) => state.users?.userDetails);
    const id_User = userData?.id_User;
    console.log("userData desde Redux:", userData);
    console.log("id_User desde userData:", id_User);

    useEffect(() => {
  if (id_User && !userDetails) {
    console.log("Despachando getUserDetails para:", id_User);
    setLoading(true);
    dispatch(getUserDetails(id_User))
      .finally(() => setLoading(false));
  }
}, [dispatch, id_User, userDetails]);

    const subtotal = cartItems.reduce((acc, item) => {
        const quantity = item.quantities?.adults || 1;
        const price = item.totalPrice || item.price || 0;
        return acc + price * quantity;
    }, 0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'dni', 'paymentMethod'];
        return requiredFields.every((field) => formData[field]?.trim());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading || !id_User) {
            alert('Cargando datos del usuario. Por favor espera...');
            return;
        }

        if (!validateForm()) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const orderData = {
            orderDate: new Date().toISOString(),
            id_User,
            paymentMethod: formData.paymentMethod,
            items: cartItems.map((item) => ({
                title: item.title,
                ServiceId: item.id_Service,
                quantity: item.quantities?.adults || 1,
                price: item.price,
            })),
            paymentStatus: 'Pendiente',
        };

        console.log('Datos del pedido:', orderData);
        dispatch(createServiceOrder(orderData));
        navigate('/payment-page');
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
                        { label: 'DNI / Pasaporte *', name: 'dni', required: true },
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
                            {[
                                'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador',
                                'Paraguay', 'Perú', 'Uruguay', 'Venezuela', 'Estados Unidos',
                            ].map((country) => (
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
                        { label: 'Código Postal *', name: 'postalCode', required: true },
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
                    {cartItems.map((item, index) => (
                        <div
                            key={`order-item-${item.id_Service}-${index}`}
                            className="p-4 border rounded-md shadow-sm bg-gray-50"
                        >
                            <p className="text-lg font-medium">{item.title}</p>
                            <p className="text-sm text-gray-900">
                                {item.quantities?.adults || 1} x ${item.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-900">
                                Fecha: {item.selectedDate || 'Fecha no seleccionada'}
                            </p>
                            <p className="text-xs text-gray-900">
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
                            <option value="Pagos desde el Exterior">Pagos desde el Exterior</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        form="orderForm"
                        disabled={loading || !id_User}
                        className={`mt-6 w-full py-3 rounded-md transition-colors ${loading || !id_User
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Cargando...' : 'Confirmar Pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
