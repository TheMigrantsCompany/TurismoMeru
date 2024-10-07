import React from "react";
import Footer from '../../components/footer/Footer';
import Header from '../../components/header/Header';
import Card from "../../components/cards/Cards";
import QueryForm from "../../components/queryform/QueryForm";


const Home = () => {
    const cards = Array(5).fill(null);
  
    return (
      <div className="flex flex-col min-h-screen">
        
        <div className="flex-grow mt-16"> 
          <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-md max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cards.map((_, index) => (
                  <Card key={index} />
                ))}
            </div>
          </div>
          <Header />
          <div className="mt-8">
            <QueryForm />
          </div>
        </div>
        <Footer className="mt-auto" />
      </div>
    );
};
  
export default Home;