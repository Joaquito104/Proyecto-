export default function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "480px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {title && (
          <h2 style={{ marginBottom: "12px", fontWeight: 600 }}>{title}</h2>
        )}

        {children}

        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: "12px",
            padding: "8px 14px",
            background: "#ef4444",
            border: "none",
            borderRadius: "6px",
            color: "white",
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
