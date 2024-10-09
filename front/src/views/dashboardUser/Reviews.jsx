import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { Button, Card, Typography } from "@material-tailwind/react";

const Reviews = ({ excursionImage }) => {
  const [review, setReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(review);
    // Reiniciar el formulario después de enviar
    setReview({ name: "", rating: 0, comment: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <Card className="max-w-md w-full p-6 shadow-lg flex flex-col bg-white rounded-lg">
        <div className="mb-4">
          {excursionImage && (
            <img
              src={excursionImage}
              alt="Excursión"
              className="object-cover rounded-lg shadow-md"
            />
          )}
        </div>
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Deja tu Reseña
        </Typography>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={review.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-1">Calificación</label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-6 w-6 cursor-pointer ${
                    index < review.rating ? "text-yellow-500" : "text-gray-300"
                  } hover:text-yellow-400 transition duration-150 ease-in-out`}
                  onClick={() => setReview({ ...review, rating: index + 1 })}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-1">Comentario</label>
            <textarea
              name="comment"
              value={review.comment}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Tu comentario"
              required
            />
          </div>

          <Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-150 ease-in-out">
            Enviar Reseña
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Reviews;