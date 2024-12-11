import React, { useState, useRef, useContext } from 'react';
import { useCart } from '../shopping-cart/CartContext';
import { useDispatch } from 'react-redux';
import { createServiceOrder } from '../../redux/actions/actions';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../firebase/AuthContext';
import GetnetPayment from '../../../getnet/GetnetPayment';

const OrderForm = () => {
    const dispatch = useDispatch();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const formRef = useRef(null);

    const { id_User } = useContext(AuthContext);
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

    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const sellerId = "TU_SELLER_ID";
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
        const requiredFields = ['firstName', 'lastName', 'dni', 'paymentMethod', 'country', 'address', 'city', 'state', 'postalCode'];
        return requiredFields.every((field) => formData[field]?.trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) {
            alert('La solicitud ya está en proceso. Por favor, espera...');
            return;
        }

        if (!id_User) {
            alert('Error: No se pudo encontrar el usuario autenticado. Por favor, verifica tu sesión.');
            return;
        }

        if (cartItems.length === 0) {
            alert('No puedes confirmar un pedido sin artículos en el carrito.');
            return;
        }

        if (!validateForm()) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        setLoading(true);

        const orderData = {
            orderDate: new Date().toISOString(),
            id_User: id_User,
            paymentMethod: formData.paymentMethod,
            items: cartItems.map((item) => ({
                id_Service: item.id_Service,
                adults: item.quantities?.adults || 0,
                minors: item.quantities?.children || 0,
                seniors: item.quantities?.seniors || 0,
            })),
            paymentStatus: 'Pendiente',
        };

        try {
            const createdOrder = await dispatch(createServiceOrder(orderData));
            const { id_ServiceOrder } = createdOrder.payload;

            setOrderId(id_ServiceOrder);

            alert('¡Pedido confirmado exitosamente!');
            navigate('/order-confirmation'); 
        } catch (error) {
            console.error('Error al crear la orden:', error);
            alert('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    const handlePaymentSuccess = (response) => {
        console.log("Pago exitoso:", response);
        alert("¡Pago realizado con éxito!");
    };

    const handlePaymentError = (error) => {
        console.error("Error en el pago:", error);
        alert("Hubo un problema con el pago. Por favor, intenta de nuevo.");
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
                    {[{ label: 'Nombre *', name: 'firstName', required: true },
                    { label: 'Apellidos *', name: 'lastName', required: true },
                    { label: 'DNI / Pasaporte *', name: 'dni', required: true }].map((field) => (
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
                    {[{ label: 'Ciudad *', name: 'city', required: true },
                    { label: 'Región / Provincia *', name: 'state', required: true },
                    { label: 'Código Postal *', name: 'postalCode', required: true }].map((field) => (
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
                        const childrenTotal = (item.quantities?.children || 0) * item.price * ((100 - (item.childDiscount || 0)) / 100);
                        const seniorsTotal = (item.quantities?.seniors || 0) * item.price * ((100 - (item.seniorDiscount || 0)) / 100);

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
                                            item.price * ((100 - (item.childDiscount || 0)) / 100)
                                        ).toFixed(2)} = ${childrenTotal.toFixed(2)}
                                    </p>
                                )}
                                {item.quantities?.seniors > 0 && (
                                    <p className="text-sm text-gray-900">
                                        Jubilados: {item.quantities?.seniors} x ${(
                                            item.price * ((100 - (item.seniorDiscount || 0)) / 100)
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
                                        item.quantities?.adults * item.price +
                                        item.quantities?.children * item.price * ((100 - (item.childDiscount || 0)) / 100) +
                                        item.quantities?.seniors * item.price * ((100 - (item.seniorDiscount || 0)) / 100);
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
                                        item.quantities?.adults * item.price +
                                        item.quantities?.children * item.price * ((100 - (item.childDiscount || 0)) / 100) +
                                        item.quantities?.seniors * item.price * ((100 - (item.seniorDiscount || 0)) / 100);
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
                {formData.paymentMethod === "Pagos desde Argentina" && (
                    <div className="mt-8">
                        <GetnetPayment
                            orderId={orderId}
                            amount={subtotal}
                            sellerId={sellerId}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </div>
                )}
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={handleExternalSubmit}
                        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
