import { useState, useEffect } from "react";
import Modal from "../components/common/Modal";

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("ev3pi-token");

  useEffect(() => {
    cargarRegistros();
  }, []);

  function cargarRegistros() {
    setLoading(true);

    fetch("http://127.0.0.1:8000/api/registros/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRegistros(data))
      .finally(() => setLoading(false));
  }

  // Crear registro
  function manejarCrear(e) {
    e.preventDefault();
    const payload = { titulo, descripcion };

    fetch("http://127.0.0.1:8000/api/registros/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((nuevo) => {
        setRegistros([...registros, nuevo]);
        setTitulo("");
        setDescripcion("");
      });
  }

  function guardarEdicion(e) {
    e.preventDefault();
    const payload = {
      titulo: editando.titulo,
      descripcion: editando.descripcion,
    };

    fetch(`http://127.0.0.1:8000/api/registros/${editando.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((actualizado) => {
        setRegistros(
          registros.map((r) => (r.id === actualizado.id ? actualizado : r))
        );
        setEditando(null);
      });
  }

  function eliminarRegistro(id) {
    if (!confirm("¿Seguro que quieres eliminar este registro?")) return;

    fetch(`http://127.0.0.1:8000/api/registros/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setRegistros(registros.filter((r) => r.id !== id));
    });
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Gestión de Registros</h1>

      {/* FORMULARIO */}
      <form onSubmit={manejarCrear}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        ></textarea>

        <button type="submit">Crear registro</button>
      </form>

      {/* LISTA */}
      {registros.map((r) => (
        <div key={r.id}>
          <h3>{r.titulo}</h3>
          <p>{r.descripcion}</p>
          <button onClick={() => setEditando(r)}>Editar</button>
          <button onClick={() => eliminarRegistro(r.id)}>Eliminar</button>
        </div>
      ))}

      {/* MODAL */}
      {editando && (
        <Modal title="Editar" onClose={() => setEditando(null)}>
          <form onSubmit={guardarEdicion}>
            <input
              value={editando.titulo}
              onChange={(e) =>
                setEditando({ ...editando, titulo: e.target.value })
              }
            />
            <textarea
              value={editando.descripcion}
              onChange={(e) =>
                setEditando({ ...editando, descripcion: e.target.value })
              }
            />
            <button type="submit">Guardar</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
