import React from "react";
import aboutusImage from "../../assets/images/aboutus/aboutus.jpg"; 

export default function AboutUs() {
  return (
    <section className="bg-[#dac9aa] py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white bg-opacity-90 shadow-md rounded-lg p-10">
        <h2 className="text-4xl font-bold text-[#f4925b] text-center mb-6">
          Sobre nosotros
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
         
          <div className="flex-1 text-center md:text-left">
            <p className="text-lg font-medium text-[#4256a6] mb-4">
              <strong>Meru Viajes & Turismo</strong>
            </p>
            <p className="text-base leading-7 text-[#425a66] mb-4">
              Nos dedicamos a ofrecer servicios de excursiones, traslados y aventuras, respetando el entorno natural, entendiendo que es un valor fundamental del turismo cuidar del bosque y la montaña.
            </p>
            <p className="text-base leading-7 text-[#425a66]">
              Con atención personalizada para todos los gustos: turismo aventura, museos, navegación, trekking, y mucho más.
            </p>
          </div>
         
          <div className="flex-1">
            <img
              src={aboutusImage}  
              alt="Excursión"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
