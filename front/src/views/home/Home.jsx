import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Card from "../../components/cards/Cards";
import QueryForm from "../../components/queryform/QueryForm";
import AboutUs from "../../components/about-us/AboutUs";
import axios from "axios";
import { Typography } from "@material-tailwind/react";

const Home = () => {
  const [excursions, setExcursions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/service")
      .then((response) => {
        // Filtrar solo las excursiones activas
        const activeExcursions = response.data.filter(
          (excursion) => excursion.active === true
        );
        setExcursions(activeExcursions);
      })
      .catch((error) => {
        console.error("Error fetching excursions:", error);
      });
  }, []);

  const handleLoginSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div id="home">
        <Header />
      </div>

      {/* Main Content */}
      <div className="flex-grow mt-12 md:mt-16">
        {/* Cards Grid */}
        <div id="services" className="container mx-auto px-4 mb-12">
          <Typography
            variant="h2"
            className="text-[#d98248] text-center mb-8 font-poppins"
          >
            Nuestras Excursiones
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursions.map((excursion) => (
              <Card key={excursion.id_Service} excursion={excursion} />
            ))}
          </div>
        </div>

        {/* About Us */}
        <div id="about" className="mt-12">
          <AboutUs />
        </div>

        {/* Query Form */}
        <div id="contact" className="mt-6 w-full max-w-md mx-auto">
          <QueryForm />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
