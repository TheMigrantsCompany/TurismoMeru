import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import {
  getAllServices,
  deleteService,
  toggleServiceActiveStatus,
} from "../../../redux/actions/actions";
import {
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
    <Card className="h-full w-full mt-2 bg-[#f9f3e1] shadow-lg rounded-lg">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        {/* Botones de filtrado */}
        <div className="flex justify-start space-x-4 p-4 bg-[#f9f3e1]">
          <Button
            onClick={() => filterExcursions("all")}
            className="bg-[#4256a6] text-white py-2 rounded-lg hover:bg-[#364d73] transition-colors"
          >
            Todas
          </Button>
          <Button
            onClick={() => filterExcursions("active")}
            className="bg-[#f4925b] text-white py-2 rounded-lg hover:bg-[#d98248] transition-colors"
          >
            Activas
          </Button>
          <Button
            onClick={() => filterExcursions("inactive")}
            className="bg-[#152817] text-white py-2 rounded-lg hover:bg-[#0f1e11] transition-colors"
          >
            Inactivas
          </Button>
        </div>
      </CardHeader>

      <CardBody className="p-0">
        <SearchInput onSearch={handleSearchChange} />
        <table className="mt-4 w-full table-auto text-left">
          <thead>
            <tr>
              {[
                "Nombre",
                "Capacidad",
                "Precio",
                "Estado",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  className="p-4 border-y border-[#4256a6] bg-[#f0f5fc]"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[#4256a6]"
                  >
                    {header}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredExcursions.length > 0 ? (
              filteredExcursions.map((excursion) => (
                <tr
                  key={excursion.id_Service}
                  className="hover:bg-[#e1d4b0] transition-colors border-b border-[#4256a6]"
                >
                  <td className="p-4 text-[#4256a6]">{excursion.title}</td>
                  <td className="p-4 text-[#4256a6]">{excursion.stock}</td>
                  <td className="p-4 text-[#4256a6]">{excursion.price}</td>
                  <td className="p-4 text-[#4256a6]">
                    <Chip
                      variant="ghost"
                      size="sm"
                      value={excursion.active ? "Activa" : "Inactiva"}
                      color={excursion.active ? "green" : "red"}
                      className="text-[#4256a6]"
                    />
                  </td>
                  <td className="p-4 text-[#4256a6]">
                    <div className="flex gap-2">
                      <Tooltip content="Editar Excursión">
                        <IconButton
                          variant="text"
                          onClick={() => handleEditClick(excursion)}
                          className="text-[#4256a6]"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Eliminar Excursión">
                        <IconButton
                          variant="text"
                          onClick={() => handleDeleteExcursion(excursion.title)}
                          className="text-[#e53935]"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-[#4256a6]"
                >
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      {showModal && (
        <ExcursionModal
          excursion={selectedExcursion}
          onClose={() => setShowModal(false)}
          onToggleActive={handleToggleActiveStatus}
          onUpdate={updateExcursionLocally}
        />
      )}
    </Card>
  );
};

export default ExcursionTable;
