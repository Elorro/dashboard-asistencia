import React, { useEffect, useMemo, useState } from "react";
import {
  obtenerTrabajadores,
  actualizarTrabajador,
  eliminarTrabajador,
  type Trabajador,
  type TrabajadorUpdatePayload,
} from "../../api/asistenciaService";
import {
  WorkerListContainer,
  WorkerTable,
  WorkerButton,
  Modal,
  ModalContent,
  PhotoGallery,
  Photo,
  CloseButton,
  Toolbar,
  SearchInput,
  PhotoCluster,
  PhotoThumb,
  DetailGrid,
  ErrorText,
  Subtitle,
} from "../workerList/WorkerList.styles";

const normalize = (value: string) => value.trim().toLowerCase();

const buildSearchText = (trabajador: Trabajador): string =>
  [
    trabajador.id,
    trabajador.document_id,
    trabajador.first_name,
    trabajador.last_name,
    trabajador.email,
  ]
    .join(" ")
    .toLowerCase();

const WorkerList: React.FC = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] =
    useState<Trabajador | null>(null);
  const [formState, setFormState] = useState<TrabajadorUpdatePayload>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [exitoMensaje, setExitoMensaje] = useState<string | null>(null);

  useEffect(() => {
    void cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async () => {
    setLoading(true);
    setListError(null);
    try {
      const data = await obtenerTrabajadores();
      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTrabajadores(data);
    } catch (error) {
      console.error("Error cargando trabajadores:", error);
      setListError("No se pudieron cargar los trabajadores. Verifica la API.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrabajadores = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return trabajadores;
    return trabajadores.filter((trabajador) =>
      buildSearchText(trabajador).includes(term)
    );
  }, [trabajadores, searchTerm]);

  const abrirModal = (trabajador: Trabajador) => {
    setEmpleadoSeleccionado(trabajador);
    setFormState({
      first_name: trabajador.first_name,
      last_name: trabajador.last_name,
      email: trabajador.email,
    });
    setExitoMensaje(null);
    setFormError(null);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEmpleadoSeleccionado(null);
    setFormState({});
  };

  const handleGuardarCambios = async () => {
    if (!empleadoSeleccionado) return;
    setSaving(true);
    setFormError(null);
    try {
      await actualizarTrabajador(empleadoSeleccionado.id, formState);
      await cargarTrabajadores();
      setExitoMensaje("Datos actualizados correctamente.");
    } catch (error) {
      console.error("Error actualizando trabajador:", error);
      setFormError(
        error instanceof Error
          ? error.message
          : "No se pudieron actualizar los datos."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este trabajador?")) {
      return;
    }
    setListError(null);
    try {
      await eliminarTrabajador(id);
      await cargarTrabajadores();
    } catch (error) {
      console.error("Error eliminando empleado:", error);
      setListError("No se pudo eliminar al trabajador.");
    }
  };

  return (
    <WorkerListContainer>
      <div>
        <h2>Registrados biométricos</h2>
        <p>Visualiza la base de empleados y actualiza sus datos cuando sea necesario.</p>
      </div>

      <Toolbar>
        <SearchInput
          type="search"
          placeholder="Buscar por nombre, ID, documento o correo"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <WorkerButton variant="primary" onClick={() => void cargarTrabajadores()}>
          Actualizar lista
        </WorkerButton>
      </Toolbar>

      {listError && <ErrorText>{listError}</ErrorText>}
      {exitoMensaje && <p style={{ color: "#2e7d32" }}>{exitoMensaje}</p>}

      {loading ? (
        <p>Cargando trabajadores...</p>
      ) : (
        <WorkerTable>
          <thead>
            <tr>
              <th>Fotos</th>
              <th>ID</th>
              <th>Documento</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrabajadores.length === 0 ? (
              <tr>
                <td colSpan={8}>No se encontraron trabajadores con ese criterio.</td>
              </tr>
            ) : (
              filteredTrabajadores.map((trabajador) => (
                <tr key={trabajador.id}>
                  <td>
                    <PhotoCluster>
                      {trabajador.image_urls.slice(0, 3).map((url, index) => (
                        <PhotoThumb key={index} src={url} alt={`${trabajador.first_name} ${index + 1}`} />
                      ))}
                    </PhotoCluster>
                  </td>
                  <td>{trabajador.id}</td>
                  <td>{trabajador.document_id}</td>
                  <td>{trabajador.first_name}</td>
                  <td>{trabajador.last_name}</td>
                  <td>{trabajador.email}</td>
                  <td>
                    {new Date(trabajador.created_at).toLocaleString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    <WorkerButton variant="view" onClick={() => abrirModal(trabajador)}>
                      Ver / Editar
                    </WorkerButton>
                    <WorkerButton
                      variant="delete"
                      onClick={() => handleEliminar(trabajador.id)}
                    >
                      Eliminar
                    </WorkerButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </WorkerTable>
      )}

      {modalVisible && empleadoSeleccionado && (
        <Modal>
          <ModalContent>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Subtitle>Ficha del colaborador</Subtitle>
              <CloseButton onClick={cerrarModal}>Cerrar</CloseButton>
            </div>

            <DetailGrid>
              <label>
                Identificador interno
                <input value={empleadoSeleccionado.id} readOnly />
              </label>
              <label>
                Documento
                <input value={empleadoSeleccionado.document_id} readOnly />
              </label>
              <label>
                Nombres
                <input
                  value={formState.first_name ?? ""}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      first_name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Apellidos
                <input
                  value={formState.last_name ?? ""}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      last_name: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Correo electrónico
                <input
                  type="email"
                  value={formState.email ?? ""}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </label>
            </DetailGrid>

            <div>
              <Subtitle>Galería biométrica</Subtitle>
              <PhotoGallery>
                {empleadoSeleccionado.image_urls.length === 0 ? (
                  <p>Sin fotos asociadas.</p>
                ) : (
                  empleadoSeleccionado.image_urls.map((url, index) => (
                    <Photo key={index} src={url} alt={`Foto ${index + 1}`} />
                  ))
                )}
              </PhotoGallery>
            </div>

            {formError && <ErrorText>{formError}</ErrorText>}

            <WorkerButton
              variant="primary"
              onClick={handleGuardarCambios}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </WorkerButton>
          </ModalContent>
        </Modal>
      )}
    </WorkerListContainer>
  );
};

export default WorkerList;
