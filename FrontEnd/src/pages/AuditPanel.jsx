import { useEffect, useState } from "react";
import { obtenerPendientes } from "../services/validacionService";

export default function AuditPanel() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerPendientes();
        setItems(data);
      } catch (err) {
        console.error("ERROR REAL:", err);
        setError("Error cargando bandeja de validación");
      }
    };

    cargar();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Bandeja de Validación</h2>

      {items.length === 0 ? (
        <p>No hay calificaciones pendientes</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Registro</th>
              <th>Estado</th>
              <th>Creado por</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.registro.titulo}</td>
                <td>{c.estado}</td>
                <td>{c.creado_por}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
