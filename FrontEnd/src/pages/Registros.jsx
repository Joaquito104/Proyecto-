import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../App";
import {
  obtenerRegistros,
  eliminarRegistro,
  editarRegistro,
} from "../services/registrosService";
import {
  crearCalificacion,
  enviarValidacion,
} from "../services/calificacionesService";

export default function Registros() {
  const { user } = useContext(AuthContext);
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState("");

  const cargarRegistros = async () => {
    try {
      const data = await obtenerRegistros();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Error cargando registros");
      setRegistros([]);
    }
  };

  useEffect(() => {
    cargarRegistros();
  }, []);

  const ultimaCalificacion = (r) =>
    r.calificaciones && r.calificaciones.length > 0
      ? r.calificaciones[r.calificaciones.length - 1]
      : null;

  const handleCrearCalificacion = async (registroId) => {
    try {
      await crearCalificacion(registroId);
      alert("Calificación creada (BORRADOR)");
      cargarRegistros();
    } catch {
      alert("Error creando calificación");
    }
  };

  const handleEnviarValidacion = async (calificacionId) => {
    try {
      await enviarValidacion(calificacionId);
      alert("Enviado a validación");
      cargarRegistros();
    } catch {
      alert("Error enviando a validación");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    await eliminarRegistro(id);
    cargarRegistros();
  };

  const handleEditar = async (r) => {
    const titulo = prompt("Nuevo título", r.titulo);
    if (!titulo) return;

    await editarRegistro(r.id, { titulo });
    cargarRegistros();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Registros</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {registros.length === 0 && <p>No hay registros</p>}

      {registros.map((r) => {
        const cal = ultimaCalificacion(r);

        return (
          <div
            key={r.id}
            style={{
              background: "#0f172a",
              padding: 16,
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            <h3>{r.titulo}</h3>
            <p>{r.descripcion}</p>

            {/* ESTADO */}
            {cal && (
              <p>
                Estado: <b>{cal.estado}</b>
              </p>
            )}

            {/* BOTONES */}
            {user?.rol === "ANALISTA" && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => handleEditar(r)} style={btn("gray")}>
                  Editar
                </button>

                <button
                  onClick={() => handleEliminar(r.id)}
                  style={btn("red")}
                >
                  Eliminar
                </button>

                {!cal && (
                  <button
                    onClick={() => handleCrearCalificacion(r.id)}
                    style={btn("blue")}
                  >
                    Crear calificación
                  </button>
                )}

                {cal?.estado === "BORRADOR" && (
                  <button
                    onClick={() => handleEnviarValidacion(cal.id)}
                    style={btn("orange")}
                  >
                    Enviar a validación
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const btn = (color) => ({
  background:
    color === "blue"
      ? "#2563eb"
      : color === "orange"
      ? "#f59e0b"
      : color === "red"
      ? "#dc2626"
      : "#334155",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
});
