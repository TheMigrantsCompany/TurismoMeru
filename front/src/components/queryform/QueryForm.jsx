import React, { useState } from 'react';
import emailjs from 'emailjs-com';

export default function QueryForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    console.log(new FormData(form));

    emailjs
      .sendForm(
        'service_e16n55p',
        'template_jx63lkb',
        form,
        'jc-fU38g2VvhTbgs8'
      )
      .then(
        (result) => {
          alert('¡Consulta enviada exitosamente!');
        },
        (error) => {
          alert('Error al enviar consulta, intenta nuevamente.');
        }
      );

    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#4256a6]">Consulta</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
      
        <input
          type="hidden"
          name="subject"
          value={`Consulta de ${formData.name || "Cliente"}`} 
        />
        <div>
          <label className="block text-[#152817] text-sm font-medium mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            name="from_name" 
            type="text"
            className="w-full px-4 py-3 border border-[#dac9aa] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#4256a6] transition duration-200 ease-in-out"
            placeholder="Escribe tu nombre"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-[#152817] text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="from_email"
            type="email"
            className="w-full px-4 py-3 border border-[#dac9aa] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#4256a6] transition duration-200 ease-in-out"
            placeholder="Escribe tu email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#152817] text-sm font-medium mb-2" htmlFor="message">
            Consulta
          </label>
          <textarea
            id="message"
            name="message" 
            className="w-full px-4 py-3 border border-[#dac9aa] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#4256a6] transition duration-200 ease-in-out"
            rows="4"
            placeholder="Escribe tu consulta"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-[#4256a6] text-white font-semibold py-3 rounded-lg hover:bg-[#f4925b] focus:outline-none focus:ring-2 focus:ring-[#f4925b] transition duration-200 ease-in-out"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
