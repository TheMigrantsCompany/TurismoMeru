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
        companyName: '',
        accommodation: '',
        country: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        paymentMethod: '',
    });

    const userDetails = useSelector((state) => state.userDetails);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getUserDetails())
            .finally(() => setLoading(false));
    }, [dispatch]);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + (item.totalPrice || item.price * (item.quantities?.adults || 1)),
        0
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Estado de loading:", loading);
        console.log("Detalles de usuario:", userDetails);

        if (loading) {
            console.log("Detalles del usuario aún no cargados");
            return; // No enviar si los detalles no están cargados
        }

        const orderData = {
            orderDate: new Date().toISOString(), // Formato ISO
            id_User: userDetails?.id_User, // Usa el id_User del backend
            paymentMethod: formData.paymentMethod,
            items: cartItems.map(item => ({
                title: item.title,
                ServiceId: item.id_Service, // Asegúrate de que esto exista
                quantity: item.quantities?.adults || 1,
                price: item.price,
            })),
            paymentStatus: 'Pendiente',
        };

        console.log('Enviando datos del pedido:', orderData);

        dispatch(createServiceOrder(orderData));
        navigate('/payment-page');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 mt-10">
            <form
                ref={formRef} // Asocia el ref al formulario
                onSubmit={handleSubmit}
                id="orderForm" // Agrega un ID para referenciarlo
                className="flex-1 text-gray-900 p-8 rounded-lg shadow-md border border-gray-300"
            >
                <h2 className="text-xl font-bold text-gray-700 mb-6">Detalles de Facturación</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellidos *</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">DNI / Pasaporte *</label>
                        <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

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
                            <option value="Argentina">Argentina</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Brasil">Brasil</option>
                            <option value="Chile">Chile</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Perú">Perú</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Estados Unidos">Estados Unidos</option>
                        </select>
                    </div>
                </div>

                {/* Campos de dirección */}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ciudad *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Región / Provincia *</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                            placeholder="Escribe tu región o provincia"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Código Postal *</label>
                        <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
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
                            <option value="Pagos desde Argentina">Pagos desde Argentina</option>
                            <option value="Pagos desde el Exterior">Pagos desde el Exterior</option>

                        </select>
                    </div>
                    <button
                        type="submit"
                        form="orderForm" // Asociado al ID del formulario
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;