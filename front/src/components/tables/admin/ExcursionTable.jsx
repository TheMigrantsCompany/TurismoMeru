import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getAllServices,
  deleteService,
  toggleServiceActiveStatus,
} from "../../../redux/actions/actions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Chip,
  IconButton,
  Button,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import ExcursionModal from "../../modals/admin-modal/ExcursionModal";
import SearchInput from "../../inputs/SearchInput";
import axios from "axios";

const selectExcursions = createSelector(
  (state) => state.excursions,
  (excursions) => excursions || []
);

const ExcursionTable = () => {
  const dispatch = useDispatch();
  const excursions = useSelector(selectExcursions);
  const [selectedExcursion, setSelectedExcursion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredExcursions, setFilteredExcursions] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  useEffect(() => {
    setFilteredExcursions(excursions);
  }, [excursions]);

  const applyFiltersByStatus = (excursionsList, status) => {
    if (status === "active") {
      return excursionsList.filter((excursion) => excursion.active);
    } else if (status === "inactive") {
      return excursionsList.filter((excursion) => !excursion.active);
    }
    return excursionsList;
  };

  const updateFilteredExcursions = () => {
    const filteredByStatus = applyFiltersByStatus(excursions, filterStatus);
    setFilteredExcursions(filteredByStatus);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(async () => {
      if (query.trim().length >= 3) {
        try {
          const response = await axios.get(
            `http://localhost:3001/service/name/${query}`
          );
          const searchResults = response.data || [];
          setFilteredExcursions(searchResults);
        } catch (error) {
          console.error("Error al buscar la excursión:", error);
          setFilteredExcursions([]);
        }
      } else {
        updateFilteredExcursions();
      }
    }, 300);
    setTimeoutId(newTimeoutId);
  };

  const filterExcursions = (status) => {
    setFilterStatus(status);
    const filteredByStatus = applyFiltersByStatus(excursions, status);
    setFilteredExcursions(filteredByStatus);
  };

  const handleDeleteExcursion = (title) => {
    dispatch(deleteService(title))
      .then(() => {
        dispatch(getAllServices());
        updateFilteredExcursions();
      })
      .catch((error) => console.error("Error eliminando la excursión:", error));
  };

  const handleToggleActiveStatus = (id_Service) => {
    dispatch(toggleServiceActiveStatus(id_Service))
      .then(() => {
        dispatch(getAllServices());
        updateFilteredExcursions();
      })
      .catch((error) =>
        console.error("Error cambiando el estado de la excursión:", error)
      );
  };

  const handleEditClick = (excursion) => {
    setSelectedExcursion(excursion);
    setShowModal(true);
  };

  const updateExcursionLocally = (updatedExcursion) => {
    setFilteredExcursions((prevExcursions) =>
      prevExcursions.map((excursion) =>
        excursion.id_Service === updatedExcursion.id_Service
          ? updatedExcursion
          : excursion
      )
    );
  };

  return (
    <div className="w-full bg-[#f9f3e1]">
      <div className="flex justify-start gap-4 p-4">
        <Button
          onClick={() => filterExcursions("all")}
          className="bg-[#4256a6] text-white px-6 py-2 rounded-lg hover:bg-[#334477] transition-colors font-poppins"
        >
          Todas
        </Button>
        <Button
          onClick={() => filterExcursions("active")}
          className="bg-[#f4925b] text-white px-6 py-2 rounded-lg hover:bg-[#d98248] transition-colors font-poppins"
        >
          Activas
        </Button>
        <Button
          onClick={() => filterExcursions("inactive")}
          className="bg-[#425a66] text-white px-6 py-2 rounded-lg hover:bg-[#2f4047] transition-colors font-poppins"
        >
          Inactivas
        </Button>
      </div>

      <div className="px-4 mb-6">
        <SearchInput
          onSearch={handleSearchChange}
          className="w-full px-4 py-2 rounded-lg border border-[#425a66]/20 focus:ring-2 focus:ring-[#4256a6] focus:border-transparent transition-all bg-white"
        />
      </div>

      <div className="overflow-x-auto bg-[#f9f3e1]">
        <table className="w-full min-w-max table-auto text-left bg-[#f9f3e1]">
          <thead>
            <tr>
              {["Nombre", "Capacidad", "Precio", "Estado", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className="border-b border-[#425a66] bg-[#dac9aa] p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-poppins font-bold text-[#4256a6] opacity-90"
                    >
                      {header}
                    </Typography>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-[#f9f3e1]">
            {filteredExcursions.length > 0 ? (
              filteredExcursions.map((excursion) => (
                <tr
                  key={excursion.id_Service}
                  className="hover:bg-[#dac9aa]/30 transition-colors border-b border-[#425a66]/20"
                >
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {excursion.title}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {excursion.stock}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography className="font-poppins text-[#425a66]">
                      {excursion.price}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full font-poppins ${
                        excursion.active
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {excursion.active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <Tooltip content="Editar Excursión">
                        <IconButton
                          variant="text"
                          onClick={() => handleEditClick(excursion)}
                          className="text-[#4256a6] hover:bg-[#4256a6]/10"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar Excursión">
                        <IconButton
                          variant="text"
                          onClick={() => handleDeleteExcursion(excursion.title)}
                          className="text-red-500 hover:bg-red-100"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  <Typography className="font-poppins text-[#4256a6]">
                    No se encontraron resultados.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ExcursionModal
          excursion={selectedExcursion}
          onClose={() => setShowModal(false)}
          onToggleActive={handleToggleActiveStatus}
          onUpdate={updateExcursionLocally}
        />
      )}
    </div>
  );
};

export default ExcursionTable;
