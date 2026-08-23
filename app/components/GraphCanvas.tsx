import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

// ── 4D Tesseract Geometry (16 vertices, 32 edges) ───────────────────
const TESSERACT_VERTICES: [number, number, number, number][] = [];
for (let x = -1; x <= 1; x += 2) {
  for (let y = -1; y <= 1; y += 2) {
    for (let z = -1; z <= 1; z += 2) {
      for (let w = -1; w <= 1; w += 2) {
        TESSERACT_VERTICES.push([x, y, z, w]);
      }
    }
  }
}

const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < TESSERACT_VERTICES.length; i++) {
  for (let j = i + 1; j < TESSERACT_VERTICES.length; j++) {
    let diff = 0;
    for (let k = 0; k < 4; k++) {
      if (TESSERACT_VERTICES[i][k] !== TESSERACT_VERTICES[j][k]) diff++;
    }
    if (diff === 1) {
      TESSERACT_EDGES.push([i, j]);
    }
  }
}

// ── 3D Octahedron Geometry (6 vertices, 12 edges) ───────────────────
const OCTAHEDRON_VERTICES: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const OCTAHEDRON_EDGES: [number, number][] = [
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 4],
  [4, 3],
  [3, 5],
  [5, 2],
];

// ── 3D Icosahedron Geometry (12 vertices, 30 edges) ─────────────────
const PHI = (1 + Math.sqrt(5)) / 2;
const ICOSAHEDRON_VERTICES: [number, number, number][] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
];
const ICOSAHEDRON_EDGES: [number, number][] = [];
for (let i = 0; i < ICOSAHEDRON_VERTICES.length; i++) {
  for (let j = i + 1; j < ICOSAHEDRON_VERTICES.length; j++) {
    const [x1, y1, z1] = ICOSAHEDRON_VERTICES[i];
    const [x2, y2, z2] = ICOSAHEDRON_VERTICES[j];
    const distSq = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;
    if (Math.abs(distSq - 4) < 0.1) {
      ICOSAHEDRON_EDGES.push([i, j]);
    }
  }
}

/**
 * Pure Mathematical & Geometric Canvas:
 * 1. 4D Tesseract & 3D Wireframe Polyhedra (Octahedron, Icosahedron)
 * 2. Delaunay-style Triangular Geometric Mesh
 * 3. Continuous Fluid Cursor Spline Trail
 *
 * 100% Monochromatic & Clean - Zero text/code symbol noise.
 */
export function GraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -9999;
    let mouseY = -9999;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let isHovering = false;

    const trail: TrailPoint[] = [];

    const isMobile = width < 768;
    const nodeCount = isMobile ? 22 : 44;
    const maxEdgeDistance = isMobile ? 90 : 125;
    const mouseRadius = isMobile ? 100 : 160;

    const nodes: Node[] = [];

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        const radius = Math.random() * 1.1 + 0.8;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius: radius,
          radius: radius,
        });
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHovering = true;

      trail.push({ x: mouseX, y: mouseY, time: performance.now() });
      if (trail.length > 30) trail.shift();

      targetTiltX = (e.clientX / width - 0.5) * 0.4;
      targetTiltY = (e.clientY / height - 0.5) * 0.4;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      isHovering = false;
      targetTiltX = 0;
      targetTiltY = 0;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let angleXW = 0;
    let angleYZ = 0;
    let angleXZ = 0;
    let polyAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();

      angleXW += 0.006;
      angleYZ += 0.004;
      angleXZ += 0.0025;
      polyAngle += 0.005;

      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      // ── 1. 4D Tesseract Geometric Projection (Upper-Right) ────────────
      const tesseractCenterX = isMobile ? width * 0.82 : width * 0.84;
      const tesseractCenterY = isMobile ? height * 0.28 : height * 0.35;
      const tesseractScale = isMobile ? Math.min(width, height) * 0.22 : Math.min(width, height) * 0.32;

      const projectedTesseract: [number, number][] = [];

      for (let i = 0; i < TESSERACT_VERTICES.length; i++) {
        const [x, y, z, w] = TESSERACT_VERTICES[i];
        const cosXW = Math.cos(angleXW);
        const sinXW = Math.sin(angleXW);
        const x1 = x * cosXW - w * sinXW;
        const w1 = x * sinXW + w * cosXW;

        const cosYZ = Math.cos(angleYZ + tiltX);
        const sinYZ = Math.sin(angleYZ + tiltX);
        const y1 = y * cosYZ - z * sinYZ;
        const z1 = y * sinYZ + z * cosYZ;

        const cosXZ = Math.cos(angleXZ + tiltY);
        const sinXZ = Math.sin(angleXZ + tiltY);
        const x2 = x1 * cosXZ - z1 * sinXZ;
        const z2 = x1 * sinXZ + z1 * cosXZ;

        const scale4 = 1 / (2.4 - w1 * 0.6);
        const scale3 = 1 / (2.6 - z2 * scale4 * 0.5);
        const px = tesseractCenterX + x2 * scale4 * scale3 * tesseractScale;
        const py = tesseractCenterY + y1 * scale4 * scale3 * tesseractScale;

        projectedTesseract.push([px, py]);
      }

      ctx.lineWidth = 0.55;
      for (let i = 0; i < TESSERACT_EDGES.length; i++) {
        const [u, v] = TESSERACT_EDGES[i];
        const [x1, y1] = projectedTesseract[u];
        const [x2, y2] = projectedTesseract[v];

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(10, 10, 10, 0.07)";
        ctx.stroke();
      }

      // ── 2. Floating 3D Octahedron Wireframe (Mid-Right Ambient) ───────
      if (!isMobile) {
        const octCenterX = width * 0.68;
        const octCenterY = height * 0.72;
        const octScale = 42;
        const projectedOct: [number, number][] = [];

        const cosP = Math.cos(polyAngle);
        const sinP = Math.sin(polyAngle);

        for (let i = 0; i < OCTAHEDRON_VERTICES.length; i++) {
          const [x, y, z] = OCTAHEDRON_VERTICES[i];
          const x1 = x * cosP - z * sinP;
          const z1 = x * sinP + z * cosP;
          const y1 = y * cosP - z1 * sinP;
          const z2 = y * sinP + z1 * cosP;

          const sz = 1 / (3 - z2 * 0.4);
          projectedOct.push([octCenterX + x1 * sz * octScale, octCenterY + y1 * sz * octScale]);
        }

        for (let i = 0; i < OCTAHEDRON_EDGES.length; i++) {
          const [u, v] = OCTAHEDRON_EDGES[i];
          ctx.beginPath();
          ctx.moveTo(projectedOct[u][0], projectedOct[u][1]);
          ctx.lineTo(projectedOct[v][0], projectedOct[v][1]);
          ctx.strokeStyle = "rgba(10, 10, 10, 0.05)";
          ctx.stroke();
        }

        // ── Floating 3D Icosahedron Wireframe (Upper-Mid Ambient) ─────────
        const icoCenterX = width * 0.58;
        const icoCenterY = height * 0.22;
        const icoScale = 28;
        const projectedIco: [number, number][] = [];

        const cosI = Math.cos(polyAngle * 0.7);
        const sinI = Math.sin(polyAngle * 0.7);

        for (let i = 0; i < ICOSAHEDRON_VERTICES.length; i++) {
          const [x, y, z] = ICOSAHEDRON_VERTICES[i];
          const x1 = x * cosI - z * sinI;
          const z1 = x * sinI + z * cosI;
          const y1 = y * cosI - z1 * sinI;
          const z2 = y * sinI + z1 * cosI;

          const sz = 1 / (4 - z2 * 0.3);
          projectedIco.push([icoCenterX + x1 * sz * icoScale, icoCenterY + y1 * sz * icoScale]);
        }

        for (let i = 0; i < ICOSAHEDRON_EDGES.length; i++) {
          const [u, v] = ICOSAHEDRON_EDGES[i];
          ctx.beginPath();
          ctx.moveTo(projectedIco[u][0], projectedIco[u][1]);
          ctx.lineTo(projectedIco[v][0], projectedIco[v][1]);
          ctx.strokeStyle = "rgba(10, 10, 10, 0.045)";
          ctx.stroke();
        }
      }

      // ── 3. Delaunay Geometric Triangulation Mesh ──────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        if (isHovering) {
          const dx = node.x - mouseX;
          const dy = node.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * 0.8;
            node.x += (dx / dist) * force * 1.5;
            node.y += (dy / dist) * force * 1.5;
            node.radius = node.baseRadius + (1 - dist / mouseRadius) * 1.2;
          } else {
            node.radius += (node.baseRadius - node.radius) * 0.1;
          }
        }

        // Draw geometric vertex
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 10, 10, 0.12)";
        ctx.fill();

        // Delaunay geometric edges & triangular facets
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxEdgeDistance) {
            const alpha = (1 - dist / maxEdgeDistance) * 0.045;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(10, 10, 10, ${alpha.toFixed(4)})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();

            // Look for 3rd vertex to form a subtle geometric triangle facet
            for (let k = j + 1; k < nodes.length; k++) {
              const third = nodes[k];
              const d2 = Math.hypot(node.x - third.x, node.y - third.y);
              const d3 = Math.hypot(other.x - third.x, other.y - third.y);

              if (d2 < maxEdgeDistance * 0.75 && d3 < maxEdgeDistance * 0.75) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.lineTo(third.x, third.y);
                ctx.closePath();
                ctx.fillStyle = `rgba(10, 10, 10, ${(alpha * 0.15).toFixed(5)})`;
                ctx.fill();
              }
            }
          }
        }
      }

      // ── 4. Continuous Fluid Spline Trajectory ─────────────────────────
      while (trail.length > 0 && now - trail[0].time > 260) {
        trail.shift();
      }

      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          const age = now - p1.time;
          const life = Math.max(0, 1 - age / 260);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(10, 10, 10, ${(life * 0.08).toFixed(4)})`;
          ctx.lineWidth = life * 1.2 + 0.3;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
