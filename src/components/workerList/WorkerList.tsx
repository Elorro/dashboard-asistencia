import React, { useEffect, useState } from "react";
import {
  obtenerTrabajadores,
  crearTrabajador,
  eliminarTrabajador,
  Trabajador,
} from "../../api/asistenciaService";
import {
  WorkerListContainer,
  WorkerForm,
  WorkerButton,
  WorkerTable,
  Modal,
  ModalContent,
  PhotoGallery,
  Photo,
  CloseButton,
} from "../workerList/WorkerListStyles";

// ==============================
// Tipado local
// ==============================
interface NuevoTrabajador extends Omit<Trabajador, "image_urls"> {
  image_urls: string[];
}

// ==============================
// Componente principal
// ==============================
const WorkerList: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [nuevoTrabajador, setNuevoTrabajador] = useState<NuevoTrabajador>({
    employee_id: "",
    nombres: "",
    apellidos: "",
    departamento: "",
    cargo: "",
    image_urls: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<Trabajador | null>(null);

  // ==============================
  // Cargar trabajadores al iniciar
  // ==============================
  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async (): Promise<void> => {
    try {
      const data = await obtenerTrabajadores();
      setTrabajadores(data);
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
    }
  };

  // ==============================
  // Crear trabajador nuevo
  // ==============================
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearTrabajador(nuevoTrabajador);
      setNuevoTrabajador({
        employee_id: "",
        nombres: "",
        apellidos: "",
        departamento: "",
        cargo: "",
        image_urls: [],
      });
      cargarTrabajadores();
    } catch (error) {
      console.error("Error creando trabajador:", error);
    }
  };

  // ==============================
  // Eliminar trabajador
  // ==============================
  const handleEliminar = async (id: string) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este empleado?");
    if (!confirm) return;

    try {
      await eliminarTrabajador(id);
      cargarTrabajadores();
    } catch (error) {
      console.error("Error eliminando empleado:", error);
    }
  };

  // ==============================
  // Ver detalles (abre modal)
  // ==============================
  const verDetalles = (trabajador: Trabajador) => {
    setEmpleadoSeleccionado(trabajador);
    setModalVisible(true);
  };

  // ==============================
  // Render
  // ==============================
  return (
    <WorkerListContainer>
      <h2>Gestión de Empleados</h2>

      {/* === Formulario de creación === */}
      <WorkerForm onSubmit={handleCrear}>
        <input
          placeholder="ID del empleado"
          value={nuevoTrabajador.employee_id}
          onChange={(e) =>
            setNuevoTrabajador({
              ...nuevoTrabajador,
              employee_id: e.target.value,
            })
          }
          required
        />
        <input
          placeholder="Nombres"
          value={nuevoTrabajador.nombres}
          onChange={(e) =>
            setNuevoTrabajador({
              ...nuevoTrabajador,
              nombres: e.target.value,
            })
          }
          required
        />
        <input
          placeholder="Apellidos"
          value={nuevoTrabajador.apellidos}
          onChange={(e) =>
            setNuevoTrabajador({
              ...nuevoTrabajador,
              apellidos: e.target.value,
            })
          }
          required
        />
        <input
          placeholder="Departamento"
          value={nuevoTrabajador.departamento}
          onChange={(e) =>
            setNuevoTrabajador({
              ...nuevoTrabajador,
              departamento: e.target.value,
            })
          }
          required
        />
        <input
          placeholder="Cargo"
          value={nuevoTrabajador.cargo}
          onChange={(e) =>
            setNuevoTrabajador({
              ...nuevoTrabajador,
              cargo: e.target.value,
            })
          }
          required
        />

        <WorkerButton variant="add" type="submit">
          Agregar
        </WorkerButton>
      </WorkerForm>

      {/* === Tabla de empleados === */}
      <WorkerTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Departamento</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trabajadores.length > 0 ? (
            trabajadores.map((t) => (
              <tr key={t.employee_id}>
                <td>{t.employee_id}</td>
                <td>{t.nombres}</td>
                <td>{t.apellidos}</td>
                <td>{t.departamento}</td>
                <td>{t.cargo}</td>
                <td>
                  <WorkerButton variant="view" onClick={() => verDetalles(t)}>
                    🔍 Ver
                  </WorkerButton>
                  <WorkerButton
                    variant="delete"
                    onClick={() => handleEliminar(t.employee_id)}
                  >
                    🗑️
                  </WorkerButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay trabajadores registrados.</td>
            </tr>
          )}
        </tbody>
      </WorkerTable>

      {/* === Modal de detalles === */}
      {modalVisible && empleadoSeleccionado && (
        <Modal>
          <ModalContent>
            <h3>Detalles del Empleado</h3>
            <p>
              <strong>ID:</strong> {empleadoSeleccionado.employee_id}
            </p>
            <p>
              <strong>Nombre:</strong> {empleadoSeleccionado.nombres}
            </p>
            <p>
              <strong>Apellido:</strong> {empleadoSeleccionado.apellidos}
            </p>
            <p>
              <strong>Departamento:</strong> {empleadoSeleccionado.departamento}
            </p>
            <p>
              <strong>Cargo:</strong> {empleadoSeleccionado.cargo}
            </p>

            <h4>Fotos de reconocimiento facial</h4>
            <PhotoGallery>
              {empleadoSeleccionado.image_urls &&
              empleadoSeleccionado.image_urls.length > 0 ? (
                empleadoSeleccionado.image_urls.map((url, i) => (
                  <Photo key={i} src={url} alt={`Foto ${i + 1}`} />
                ))
              ) : (
                <p>No hay fotos registradas.</p>
              )}
            </PhotoGallery>

            <CloseButton onClick={() => setModalVisible(false)}>
              Cerrar
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </WorkerListContainer>
  );
};

export default WorkerList;
