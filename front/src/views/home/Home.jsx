import React, { useEffect, useState } from "react";
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Card from '../../components/cards/Cards'
import QueryForm from "../../components/queryform/QueryForm";
import axios from "axios"; 

const Home = () => {
  const [excursions, setExcursions] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:3001/service")
      .then((response) => {
        setExcursions(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching excursions:", error);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow mt-16">
        <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-md max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {excursions.map((excursion) => (
              <Card key={excursion.id_Service} excursion={excursion} />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <QueryForm />
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Home;
