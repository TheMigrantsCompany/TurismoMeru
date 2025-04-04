import React, { useState, useRef, useContext, useEffect } from "react";
import { useCart } from "../shopping-cart/CartContext";
import { useDispatch } from "react-redux";
import { createServiceOrder } from "../../redux/actions/actions";
import { AuthContext } from "../../firebase/AuthContext";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const OrderForm = () => {
  const dispatch = useDispatch();
  const { cartItems, clearCart } = useCart();
  const formRef = useRef(null);
  const { id_User, user } = useContext(AuthContext);
  const token = user?.token;

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
    phone: "",
    apartment: "",
  });

  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    console.log("cartItems en OrderForm:", cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (!sdkLoaded) {
      const mpKey = import.meta.env.VITE_MERCADOPAGO_KEY;
      if (!mpKey) {
        console.error(
          "⚠️ Mercado Pago key no definida en variables de entorno."
        );
        return;
      }
      initMercadoPago(mpKey, { locale: "es-AR" });
      setSdkLoaded(true);
    }
  }, [sdkLoaded]);

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
      "phone",
    ];
    return requiredFields.every((field) => formData[field]?.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return alert("⏳ Solicitud en proceso. Por favor, espera.");
    if (!id_User) return alert("⚠️ Error: Usuario no autenticado.");
    if (!validateForm())
      return alert("⚠️ Por favor, completa todos los campos obligatorios.");
    if (cartItems.length === 0) return alert("⚠️ El carrito está vacío.");

    setLoading(true);

    try {
      // ✅ Usamos los cartItems directamente sin aplicar descuentos nuevamente
      const items = cartItems.map((item) => {
        return {
          id_Service: item.id_Service,
          title: item.title || "Servicio sin título",
          description: item.description || "Sin descripción",
          totalPeople:
            item.quantities?.adults +
            item.quantities?.children +
            item.quantities?.seniors,
          unit_price:
            item.totalPrice /
              (item.quantities?.adults +
                item.quantities?.children +
                item.quantities?.seniors) || 0,
          currency_id: "ARS",
          selectedDate: item.selectedDate,
          selectedTime: item.selectedTime,
          totalItemPrice: item.totalPrice,
        };
      });

      // Calcular el total correcto sumando los precios de todos los items
      const totalPrice = items.reduce(
        (total, item) => total + item.totalItemPrice,
        0
      );

      console.log("🚀 Total antes de enviar:", totalPrice);

      // ✅ Creación de la orden
      const orderData = {
        orderDate: new Date().toISOString(),
        id_User,
        paymentMethod: formData.paymentMethod,
        items: cartItems.map((item) => {
          // Log del item completo antes del mapeo
          console.log("Item completo del carrito:", {
            item,
            quantities: item.quantities,
            babies: item.quantities?.babies,
          });

          // Log de la conversión de babies
          const babiesCount = Number(item.quantities?.babies);
          console.log("Conversión de babies:", {
            original: item.quantities?.babies,
            converted: babiesCount,
            isNumber: typeof babiesCount === "number",
            isNaN: isNaN(babiesCount),
          });

          const mappedItem = {
            id_Service: item.id_Service,
            date: item.selectedDate,
            time: item.selectedTime,
            adults: Number(item.quantities?.adults) || 0,
            minors: Number(item.quantities?.children) || 0,
            seniors: Number(item.quantities?.seniors) || 0,
            babies: babiesCount || 0,
            totalItemPrice: item.totalPrice,
          };

          // Log del item mapeado
          console.log("Item después del mapeo:", mappedItem);

          return mappedItem;
        }),
        paymentStatus: "Pendiente",
      };

      // Log de la orden completa
      console.log(
        "Orden completa a enviar:",
        JSON.stringify(orderData, null, 2)
      );

      const createdOrder = await dispatch(createServiceOrder(orderData));

      if (!createdOrder?.id_ServiceOrder) {
        throw new Error("Error al crear la orden. ID no recibido.");
      }

      setOrderId(createdOrder.id_ServiceOrder);

      // Enviar la preferencia a MercadoPago
      if (formData.paymentMethod === "Pagos desde Argentina") {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/payment/create-preference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentInformation: items,
            id_User,
            DNI: formData.dni,
            email: formData.email,
            id_ServiceOrder: createdOrder.id_ServiceOrder,
            external_reference: createdOrder.id_ServiceOrder,
            metadata: {
              orderId: createdOrder.id_ServiceOrder,
              totalPeople: items.reduce(
                (total, item) => total + item.totalPeople,
                0
              ),
              totalPrice: totalPrice,
            },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Detalles del error:", errorText);
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Preference ID recibido:", data.preferenceId);

        if (!data?.preferenceId) {
          throw new Error("No se recibió un preferenceId válido.");
        }

        setPreferenceId(data.preferenceId);
        alert("✅ ¡Pedido confirmado exitosamente!");
      } else if (formData.paymentMethod === "Pagos desde el exterior") {
        alert("✅ ¡Pedido confirmado! Proceda con el pago por WhatsApp.");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud de pago:", error);
      alert("⚠️ Hubo un error en el proceso de pago. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-10 px-8 max-w-[1600px] mx-auto">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        id="orderForm"
        className="flex-1 text-gray-900 p-8 rounded-lg shadow-md border-2 border-[#d98248]"
      >
        <h2 className="text-3xl font-bold text-[#4256a6] mb-6 font-poppins">
          Detalles de Facturación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Nombre *", name: "firstName", required: true },
            { label: "Apellidos *", name: "lastName", required: true },
            { label: "Mail *", name: "email", required: true },
            { label: "DNI / Pasaporte *", name: "dni", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#4256a6]">
                {field.label}
              </label>
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
            <label className="block text-sm font-medium text-[#4256a6] mb-1">
              País / Región *
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-[#425a66]/20 text-[#425a66] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all duration-300 bg-white"
              required
            >
              <option value="">Selecciona un país</option>
              {[
                "Argentina",
                "Bolivia",
                "Brasil",
                "Chile",
                "Colombia",
                "Ecuador",
                "Paraguay",
                "Perú",
                "Uruguay",
                "Venezuela",
                "Estados Unidos",
              ].map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4256a6] mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              className="w-full p-3 border border-[#425a66]/20 text-[#425a66] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all duration-300 bg-white"
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-[#4256a6]">
            Dirección de la calle *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-md"
            required
          />
          <label className="block text-sm font-medium text-[#4256a6] mt-4">
            Apartamento
          </label>
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
            { label: "Ciudad *", name: "city", required: true },
            { label: "Región / Provincia *", name: "state", required: true },
            { label: "Código Postal *", name: "postalCode", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-[#4256a6]">
                {field.label}
              </label>
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
      <div className="flex-1 max-w-lg mx-auto p-8 bg-[#dac9aa]/20 rounded-xl">
        <div className="bg-[#f9f3e1] rounded-xl shadow-lg space-y-4 border border-[#425a66]/10">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-[#4256a6] border-b border-[#425a66]/10 pb-4 mb-4 font-poppins">
              Resumen de la Orden
            </h2>
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item, index) => {
                  const adultsTotal =
                    (item.quantities?.adults || 0) * item.price;
                  const childrenTotal =
                    (item.quantities?.children || 0) *
                    item.price *
                    ((100 - (item.discountForMinors || 0)) / 100);
                  const seniorsTotal =
                    (item.quantities?.seniors || 0) *
                    item.price *
                    ((100 - (item.discountForSeniors || 0)) / 100);
                  const totalItemPrice = (
                    adultsTotal +
                    childrenTotal +
                    seniorsTotal
                  ).toFixed(2);

                  return (
                    <div
                       key={`order-item-${item.id_Service}-${index}`}
                      className="bg-white p-4 rounded-lg shadow-sm border border-[#425a66]/10 hover:shadow-md transition-shadow duration-300"
                    >
                      <p className="text-lg font-medium text-[#4256a6] mb-2 font-poppins">
                        {item.title}
                      </p>
                      <div className="space-y-1 text-[#425a66]">
                        {item.quantities?.adults > 0 && (
                          <p className="text-sm">
                            Adultos: {item.quantities.adults} x $
                            {item.price.toLocaleString()} = $
                            {adultsTotal.toFixed(2)}
                          </p>
                        )}
                        {item.quantities?.children > 0 && (
                          <p className="text-sm">
                            Menores: {item.quantities.children} x $
                            {(
                              item.price *
                              ((100 - (item.discountForMinors || 0)) / 100)
                            ).toFixed(2)}{" "}
                            = ${childrenTotal.toFixed(2)}
                          </p>
                        )}
                        {item.quantities?.seniors > 0 && (
                          <p className="text-sm">
                            Jubilados: {item.quantities.seniors} x $
                            {(
                              item.price *
                              ((100 - (item.discountForSeniors || 0)) / 100)
                            ).toFixed(2)}{" "}
                            = ${seniorsTotal.toFixed(2)}
                          </p>
                        )}
                        {item.quantities?.babies > 0 && (
                          <p className="text-sm">
                            Bebés: {item.quantities.babies} x $0 = $0
                          </p>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-[#425a66] border-t border-[#425a66]/10 pt-2">
                        <p>
                          Fecha: {item.selectedDate || "Fecha no seleccionada"}
                        </p>
                        <p>
                          Hora: {item.selectedTime || "Hora no seleccionada"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-[#4256a6]">
                No hay productos en el carrito.
              </p>
            )}

            <div className="bg-white p-4 rounded-lg mt-4">
              <div className="flex justify-between text-[#425a66] text-lg font-semibold">
                <p>Subtotal</p>
                <p>
                  $
                  {cartItems
                    .reduce((acc, item) => {
                      const totalItemPrice =
                        item.quantities?.adults * item.price +
                        item.quantities?.children *
                          item.price *
                          ((100 - (item.discountForMinors || 0)) / 100) +
                        item.quantities?.seniors *
                          item.price *
                          ((100 - (item.discountForSeniors || 0)) / 100);
                      return acc + totalItemPrice;
                    }, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-[#4256a6] text-xl font-bold mt-2 pt-2 border-t border-[#425a66]/10">
                <p>Total</p>
                <p>
                  $
                  {cartItems
                    .reduce((acc, item) => {
                      const totalItemPrice =
                        item.quantities?.adults * item.price +
                        item.quantities?.children *
                          item.price *
                          ((100 - (item.discountForMinors || 0)) / 100) +
                        item.quantities?.seniors *
                          item.price *
                          ((100 - (item.discountForSeniors || 0)) / 100);
                      return acc + totalItemPrice;
                    }, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-[#4256a6] mb-1">
            Método de Pago
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border border-[#425a66]/20 text-[#425a66] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all duration-300 bg-white"
            required
          >
            <option value="">Selecciona un método</option>
            <option value="Pagos desde Argentina">Pagos desde Argentina</option>
            <option value="Pagos desde el exterior">
              Pagos desde el exterior
            </option>
          </select>
        </div>
        {formData.paymentMethod === "Pagos desde Argentina" && preferenceId && (
          <div className="mt-4">
            <Wallet initialization={{ preferenceId }} />
          </div>
        )}
        {formData.paymentMethod === "Pagos desde el exterior" && orderId && (
          <a
            href={`https://wa.me/+541169084059?text=${encodeURIComponent(
              `¡Hola! Quisiera realizar una reserva con pago desde el exterior.\n\nDetalles de la reserva:\n${cartItems
                .map(
                  (item) =>
                    `• ${item.title}\n- Fecha: ${item.selectedDate}\n- Hora: ${
                      item.selectedTime
                    }\n- Personas: ${item.quantities?.adults || 0} adultos, ${
                      item.quantities?.children || 0
                    } menores, ${item.quantities?.seniors || 0} jubilados, ${
                      item.quantities?.babies || 0
                    } bebés`
                )
                .join("\n\n")}\n\nTotal a pagar: $${cartItems
                .reduce((acc, item) => {
                  const totalItemPrice =
                    item.quantities?.adults * item.price +
                    item.quantities?.children *
                      item.price *
                      ((100 - (item.discountForMinors || 0)) / 100) +
                    item.quantities?.seniors *
                      item.price *
                      ((100 - (item.discountForSeniors || 0)) / 100);
                  return acc + totalItemPrice;
                }, 0)
                .toFixed(2)}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] shadow-md hover:shadow-lg transition-all duration-300 mt-4 font-poppins"
          >
            <img
              src="https://img.icons8.com/fluent/24/000000/whatsapp.png"
              alt="WhatsApp"
              className="filter brightness-0 invert"
            />
            Contactar por WhatsApp para pago
          </a>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-3 bg-[#4256a6] text-white rounded-lg hover:bg-[#2a3875] shadow-md hover:shadow-lg transition-all duration-300 font-poppins"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
