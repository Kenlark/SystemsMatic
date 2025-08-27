export default function Maintenance() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Site en maintenance</h1>
        <p>
          Notre site est temporairement indisponible.
          <br />
          Merci de revenir plus tard.
        </p>
      </div>
    </main>
  );
}
