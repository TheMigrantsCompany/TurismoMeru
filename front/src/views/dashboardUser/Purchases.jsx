import React from 'react';
import { useNavigate } from 'react-router-dom';

const Purchases = ({ purchases }) => {
  const navigate = useNavigate();

  const samplePurchases = [
    {
      id: 1,
      excursionName: 'Excursión al Glaciar Martial',
      date: '2024-10-20',
      price: 150,
      status: 'Completada',
      people: 2,
      imageUrl: 'https://example.com/image1.jpg', 
      purchaseDate: '2024-10-01',
      excursionDate: '2024-10-20',
    },
    {
      id: 2,
      excursionName: 'Excursión al Parque Nacional Tierra del Fuego',
      date: '2024-10-21',
      price: 200,
      status: 'Pendiente',
      people: 4,
      imageUrl: 'https://example.com/image2.jpg',
      purchaseDate: '2024-10-05',
      excursionDate: '2024-10-21',
    },
  ];

  const handleViewDetails = (id) => {
    navigate(`/excursion/${id}`); // Redirige al detalle de la excursión con el ID
  };

  const dataToDisplay = purchases && purchases.length > 0 ? purchases : samplePurchases;

  return (
    <div className="container mx-auto p-6 mt-16 bg-[#f9f3e1] border-l-4 border-[#425a66] rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-[#4256a6] font-poppins">Mis Compras</h1>
      {dataToDisplay.length > 0 ? (
        <div className="space-y-6">
          {dataToDisplay.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-[#dac9aa] shadow-md rounded-lg p-4 border border-[#425a66] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={purchase.imageUrl}
                    alt={purchase.excursionName}
                    className="w-20 h-20 object-cover rounded-lg border border-[#425a66]"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[#4256a6] font-poppins">
                      {purchase.excursionName}
                    </h3>
                    <p className="text-sm text-[#425a66]">
                      Fecha de compra: {purchase.purchaseDate}
                    </p>
                    <p className="text-sm text-[#425a66]">
                      Fecha de excursión: {purchase.excursionDate}
                    </p>
                    <p className="text-sm text-[#425a66]">
                      Personas: {purchase.people}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-[#4256a6] font-poppins">
                    ${purchase.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      purchase.status === 'Completada'
                        ? 'text-green-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {purchase.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(purchase.id)}
                className="mt-4 bg-[#4256a6] text-white py-2 px-4 rounded-lg hover:bg-[#334477] transition-colors"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#4256a6] font-poppins">
          No tienes compras recientes.
        </p>
      )}
    </div>
  );
};

export default Purchases;
