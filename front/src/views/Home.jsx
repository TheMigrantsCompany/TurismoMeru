import React from "react";
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';
import Card from "../components/cards/Cards";
import QueryForm from "../components/queryform/QueryForm";
import StickyNavbar from "../components/navbar/StickyNavbar";

const Home = () => {
  const cards = Array(5).fill(null); 

  return (
    <>
      <StickyNavbar />
      <Header />
      <div className="flex flex-col items-center space-y-8 mt-8">
        {cards.map((_, index) => (
          <Card key={index} />
        ))}
      </div>
      <div className="mt-8"> 
      <QueryForm />
      </div>
      <Footer />
    </>
  );
};

export default Home;