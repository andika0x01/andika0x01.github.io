export function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div
          style={{
            overflow: "hidden",
            marginBottom: "clamp(0.5rem, 1vw, 1rem)",
          }}
        >
          <h1
            style={{
              fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
              fontSize: "clamp(48px, 12vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              color: "var(--ink)",
              margin: 0,
              animation: "slideUp 0.86s ease-out forwards",
              opacity: 0,
              transform: "translateY(100%)",
            }}
          >
            Loading
          </h1>
        </div>
        
        <div
          style={{
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: "clamp(11px, 1.5vw, 13px)",
            color: "var(--muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.62s ease-out 0.4s forwards",
            opacity: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Please wait</span>
            <span
              style={{
                display: "inline-flex",
                gap: "3px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "var(--ink)",
                  borderRadius: "50%",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              />
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "var(--ink)",
                  borderRadius: "50%",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "0.2s",
                }}
              />
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: "var(--ink)",
                  borderRadius: "50%",
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: "0.4s",
                }}
              />
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
