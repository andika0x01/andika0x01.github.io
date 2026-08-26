import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import { LoadingScreen } from "./components/LoadingScreen";
import { CustomCursor } from "./components/CustomCursor";
import "./app.css";

export async function loader(): Promise<{ buildTime: string }> {
  const buildTime = new Date().toISOString();
  
  return {
    buildTime,
  };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap",
  },
];

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Andika Dinata - Security Researcher & Software Engineer" },
    { name: "description", content: "Andika Dinata - CS student at ITERA, Security Researcher and Software Engineer based in Bandar Lampung, Indonesia. Building software to understand systems, studying security to understand how systems fail." },
    { name: "keywords", content: "Andika Dinata, Security Researcher, Software Engineer, Web Security, Cybersecurity, Developer, Portfolio, Indonesia, Bandar Lampung, ITERA" },
    { name: "author", content: "Andika Dinata" },
    { name: "robots", content: "index, follow" },
    { name: "googlebot", content: "index, follow" },
    
    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://andika0x01.github.io/" },
    { property: "og:title", content: "Andika Dinata - Security Researcher & Software Engineer" },
    { property: "og:description", content: "CS student at ITERA, Security Researcher and Software Engineer. Building software to understand systems, studying security to understand how systems fail." },
    { property: "og:image", content: "https://andika0x01.github.io/og-image.png" },
    { property: "og:site_name", content: "Andika Dinata" },
    { property: "og:locale", content: "en_US" },
    
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:url", content: "https://andika0x01.github.io/" },
    { name: "twitter:title", content: "Andika Dinata - Security Researcher & Software Engineer" },
    { name: "twitter:description", content: "CS student at ITERA, Security Researcher and Software Engineer. Building software to understand systems, studying security to understand how systems fail." },
    { name: "twitter:image", content: "https://andika0x01.github.io/og-image.png" },
    { name: "twitter:creator", content: "@andika0x01" },
    
    // Additional SEO
    { name: "theme-color", content: "#ffffff" },
    { name: "msapplication-TileColor", content: "#ffffff" },
    { name: "format-detection", content: "telephone=no" },
  ] as const;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <CustomCursor />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <LoadingScreen />;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <CustomCursor />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(20px, 5.5vw, 120px)",
          fontFamily: "'Geist', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px, 12vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              marginBottom: "clamp(1rem, 3vw, 2rem)",
              color: "var(--ink)",
            }}
          >
            {message}
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 24px)",
              fontWeight: 300,
              color: "var(--muted)",
              lineHeight: 1.6,
              marginBottom: "clamp(2rem, 5vw, 3rem)",
            }}
          >
            {details}
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: "clamp(14px, 2vw, 16px)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--ink)",
              textDecoration: "none",
              padding: "clamp(12px, 2vw, 16px) clamp(24px, 4vw, 32px)",
              border: "1px solid var(--ink)",
              borderRadius: "2px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--ink)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--ink)";
            }}
          >
            Return Home
          </a>
          {stack && (
            <div
              style={{
                marginTop: "clamp(2rem, 5vw, 3rem)",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: "clamp(11px, 1.5vw, 13px)",
                  color: "var(--muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(0.5rem, 1vw, 1rem)",
                }}
              >
                Error Details
              </p>
              <pre
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: "clamp(12px, 1.5vw, 14px)",
                  color: "var(--muted)",
                  backgroundColor: "var(--ghost)",
                  padding: "clamp(16px, 3vw, 24px)",
                  borderRadius: "2px",
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                }}
              >
                <code>{stack}</code>
              </pre>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
