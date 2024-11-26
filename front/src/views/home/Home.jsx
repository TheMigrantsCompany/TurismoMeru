import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Card from '../../components/cards/Cards'
import QueryForm from "../../components/queryform/QueryForm";
import axios from "axios"; 

const Home = () => {
  const [excursions, setExcursions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    axios.get("http://localhost:3001/service")
      .then((response) => {
        setExcursions(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching excursions:", error);
      });
  }, []);
  const handleLoginSuccess = () => {
    // Simula que el usuario inició sesión correctamente
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow mt-12 md:mt-16">
        <div className="bg-white bg-opacity-70 p-6 sm:p-8 rounded-lg shadow-md max-w-screen-lg mx-auto">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.map((excursion) => (
              <Card key={excursion.id_Service} excursion={excursion} />
            ))}
          </div>
        </div>

        {/* Query Form */}
        <div className="mt-8 w-full max-w-md mx-auto">
          <QueryForm />
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-auto" />
    </div>
  );
};

export default Home;