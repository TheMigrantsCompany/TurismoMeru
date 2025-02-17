import React from "react";
import { Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (section) => {
    navigate('/#' + section);
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <footer className="bg-[#dac9aa] flex flex-col items-center justify-center py-10 px-6">
      {/* Enlaces de navegación */}
      <nav className="flex justify-center flex-wrap gap-8 mb-8">
        <a
          onClick={() => handleNavigation('home')}
          className="text-[#4256a6] hover:text-[#2a3875] cursor-pointer font-poppins text-sm uppercase tracking-wider transition-all duration-300"
        >
          Inicio
        </a>
        <a
          onClick={() => handleNavigation('about')}
          className="text-[#4256a6] hover:text-[#2a3875] cursor-pointer font-poppins text-sm uppercase tracking-wider transition-all duration-300"
        >
          Nosotros
        </a>
        <a
          onClick={() => handleNavigation('services')}
          className="text-[#4256a6] hover:text-[#2a3875] cursor-pointer font-poppins text-sm uppercase tracking-wider transition-all duration-300"
        >
          Servicios
        </a>
        <a
          onClick={() => handleNavigation('contact')}
          className="text-[#4256a6] hover:text-[#2a3875] cursor-pointer font-poppins text-sm uppercase tracking-wider transition-all duration-300"
        >
          Contacto
        </a>
      </nav>

      {/* Redes sociales */}
      <div className="flex justify-center space-x-5 mb-6">
        <a
          href="https://www.facebook.com/profile.php?id=61554232542930"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.icons8.com/fluent/30/000000/facebook-new.png"
            alt="Facebook"
          />
        </a>
        <a
          href="https://www.instagram.com/meru.viajes?igsh=cGo2aHJtbW15MG02"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.icons8.com/fluent/30/000000/instagram-new.png"
            alt="Instagram"
          />
        </a>
        <a
          href="https://www.facebook.com/messages/t/139679312572882"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.icons8.com/fluent/30/000000/facebook-messenger--v2.png"
            alt="Messenger"
          />
        </a>
        <a
          href="https://wa.me/+541169084059"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://img.icons8.com/fluent/30/000000/whatsapp.png"
            alt="WhatsApp"
          />
        </a>
      </div>

      {/* Información de contacto */}
      <div className="text-center text-gray-700 dark:text-gray-300 mb-6">
        <p className="font-medium flex items-center justify-center gap-2">
          <img
            src="https://img.icons8.com/ios-filled/20/000000/marker.png"
            alt="Ubicación"
          />
          9410 Ushuaia, Tierra del Fuego, Argentina
        </p>
        <p className="font-medium">Email: meruevt@gmail.com</p>
        <p className="font-medium">Teléfono: +54 9 1169084059</p>
        <p className="font-medium">
          Horario de atención: Lunes a Viernes, 10:00 - 19:00
        </p>
      </div>

      <p className="text-center text-gray-700 font-medium dark:text-gray-300">
        &copy; 2024 Meru Viajes. Todos los derechos reservados.
      </p>
    </footer>
  );
}
