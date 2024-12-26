import React from "react";


export default function Footer() {
  return (
    <footer className="bg-[#dac9aa] flex flex-col items-center justify-center py-10 px-6">
     
      <nav className="flex justify-center flex-wrap gap-6 text-gray-500 font-medium mb-6">
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          Home
        </a>
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          About
        </a>
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          Services
        </a>
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          Media
        </a>
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          Gallery
        </a>
        <a
          className="hover:text-gray-900 dark:hover:text-gray-300"
          href="#"
        >
          Contac
        </a>
      </nav>

      
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

      
      <div className="text-center text-gray-700 dark:text-gray-300 mb-6">
        <p className="font-medium flex items-center justify-center gap-2">
          <img
            src="https://img.icons8.com/ios-filled/20/000000/marker.png"
            alt="Ubicación"
          />
          9410 Ushuaia, Provincia de Tierra del Fuego, Antártida e Islas del Atlántico Sur, Argentina
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
