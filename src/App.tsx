import { useEffect, useRef, useState, type ReactNode } from "react";

type Page = "menu" | "etl" | "regresion" | "arboles";

const navigation: Array<{ id: Page; label: string; number: string }> = [
  { id: "menu", label: "Menú", number: "00" },
  { id: "etl", label: "Proceso ETL", number: "01" },
  { id: "regresion", label: "Regresión lineal", number: "02" },
  { id: "arboles", label: "Árboles de decisión", number: "03" },
];

/* ═══════════════════════════════════════════════════════════════
   Scroll-reveal wrapper
   ═══════════════════════════════════════════════════════════════ */

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in${visible ? " visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRÁFICA 1: Ventas por Categoría (Barras verticales delgadas)
   ═══════════════════════════════════════════════════════════════ */

function EtlBarChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const data = [
    { label: "Tecnología", value: 294430, display: "$294,430" },
    { label: "Accesorios", value: 173170, display: "$173,170" },
    { label: "Papelería", value: 33740, display: "$33,740" },
  ];
  const maxVal = 300000;
  const barW = 34; // Barras delgadas terracota
  const gap = 140;
  const startX = (760 - (data.length * barW + (data.length - 1) * gap)) / 2;
  const top = 35;
  const bot = 250;
  const h = bot - top;
  const guides = [0, 100000, 200000, 300000];

  return (
    <svg
      className="editorial-chart"
      viewBox="0 0 760 310"
      role="img"
      aria-label="Ventas por categoría"
    >
      {guides.map((v) => {
        const y = bot - (v / maxVal) * h;
        return (
          <g key={v}>
            <line x1="80" y1={y} x2="680" y2={y} className="guide" />
            <text x="70" y={y + 3} textAnchor="end" style={{ fontSize: "8px" }}>
              {v === 0 ? "$0" : `$${v / 1000}k`}
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = startX + i * (barW + gap);
        const barH = (d.value / maxVal) * h;
        const y = bot - barH;
        const active = hovered === i;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="2"
              fill="#b5704f"
              opacity={hovered !== null && !active ? 0.45 : 1}
              style={{ transition: "opacity 160ms, transform 160ms" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              cursor="pointer"
            />
            <text
              x={x + barW / 2}
              y={bot + 24}
              textAnchor="middle"
              style={{ fontSize: "10px", fill: "#5d554e" }}
            >
              {d.label}
            </text>
            {active && (
              <g>
                <rect
                  x={x + barW / 2 - 48}
                  y={y - 32}
                  width="96"
                  height="24"
                  rx="4"
                  fill="#2b2622"
                />
                <text
                  x={x + barW / 2}
                  y={y - 16}
                  textAnchor="middle"
                  fill="#f4eee6"
                  style={{ fontSize: "9px", fontWeight: 500 }}
                >
                  {d.display}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRÁFICA 2: Dispersión con Línea (Eje Y: 50 a 100, Eje X: 0 a 10)
   ═══════════════════════════════════════════════════════════════ */

function RegressionScatterChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const points = [
    { x: 1, y: 55 },
    { x: 2, y: 60 },
    { x: 3, y: 65 },
    { x: 4, y: 70 },
    { x: 5, y: 75 },
    { x: 6, y: 80 },
    { x: 7, y: 85 },
    { x: 8, y: 90 },
  ];
  const prediction = { x: 9, y: 95 };

  // Eje X: 0 a 10; Eje Y: 50 a 100
  const mx = (x: number) => 80 + (x / 10) * 600;
  const my = (y: number) => 260 - ((y - 50) / 50) * 220;

  return (
    <svg
      className="editorial-chart"
      viewBox="0 0 760 310"
      role="img"
      aria-label="Horas de estudio y calificación"
    >
      {/* Guías eje Y de 50 a 100 */}
      {[50, 60, 70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line x1="70" y1={my(v)} x2="690" y2={my(v)} className="guide" />
          <text x="62" y={my(v) + 3} textAnchor="end" style={{ fontSize: "8px" }}>
            {v}
          </text>
        </g>
      ))}

      {/* Etiquetas eje X de 0 a 10 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
        <text key={v} x={mx(v)} y="284" textAnchor="middle" style={{ fontSize: "8.5px" }}>
          {v}h
        </text>
      ))}

      {/* Línea recta Y = 50 + 5X */}
      <line
        x1={mx(0)}
        y1={my(50)}
        x2={mx(10)}
        y2={my(100)}
        className="data-line regression-line"
      />

      {/* 8 Puntos de datos */}
      {points.map((p, i) => {
        const px = mx(p.x);
        const py = my(p.y);
        const active = hovered === i;
        return (
          <g key={i}>
            <circle
              cx={px}
              cy={py}
              r="12"
              fill="transparent"
              stroke="none"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              cursor="pointer"
            />
            <circle cx={px} cy={py} r="4" className="observation" pointerEvents="none" />
            {active && (
              <g>
                <rect x={px - 44} y={py - 30} width="88" height="22" rx="4" fill="#2b2622" />
                <text
                  x={px}
                  y={py - 15}
                  textAnchor="middle"
                  fill="#f4eee6"
                  style={{ fontSize: "8.5px", fontWeight: 500 }}
                >
                  ({p.x}h, {p.y})
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Punto destacado de predicción (9, 95) con etiqueta visible */}
      {(() => {
        const px = mx(prediction.x);
        const py = my(prediction.y);
        return (
          <g>
            {/* Círculo exterior destacado */}
            <circle
              cx={px}
              cy={py}
              r="7"
              fill="none"
              stroke="#b5704f"
              strokeWidth="1.6"
              strokeDasharray="3 2"
            />
            <circle cx={px} cy={py} r="3" fill="#b5704f" />

            {/* Etiqueta visible 'Predicción: 95' */}
            <rect
              x={px - 82}
              y={py - 13}
              width="74"
              height="24"
              rx="3"
              fill="#ebe3d7"
              stroke="#b5704f"
              strokeWidth="1"
            />
            <text
              x={px - 45}
              y={py + 3}
              textAnchor="middle"
              fill="#b5704f"
              style={{
                fontSize: "8.5px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Predicción: 95
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GRÁFICA 3: Árbol de Decisión Completo (4 niveles, 8 hojas)
   ═══════════════════════════════════════════════════════════════ */

function DecisionTreeChart() {
  // Coordenadas X para las 8 hojas finales distribuidas a lo largo de 760px
  const leavesX = [55, 140, 225, 310, 450, 535, 620, 705];

  // Nivel 2: 4 nodos
  const l2X = [
    (leavesX[0] + leavesX[1]) / 2, // 97.5
    (leavesX[2] + leavesX[3]) / 2, // 267.5
    (leavesX[4] + leavesX[5]) / 2, // 492.5
    (leavesX[6] + leavesX[7]) / 2, // 662.5
  ];

  // Nivel 1: 2 nodos
  const l1X = [
    (l2X[0] + l2X[1]) / 2, // 182.5
    (l2X[2] + l2X[3]) / 2, // 577.5
  ];

  // Raíz
  const rootX = (l1X[0] + l1X[1]) / 2; // 380

  const leaves = [
    { x: leavesX[0], label: "Sobrevive", survives: true },
    { x: leavesX[1], label: "Sobrevive", survives: true },
    { x: leavesX[2], label: "Sobrevive", survives: true },
    { x: leavesX[3], label: "No sobrevive", survives: false },
    { x: leavesX[4], label: "Sobrevive", survives: true },
    { x: leavesX[5], label: "No sobrevive", survives: false },
    { x: leavesX[6], label: "No sobrevive", survives: false },
    { x: leavesX[7], label: "No sobrevive", survives: false },
  ];

  return (
    <svg
      className="editorial-chart tree-chart"
      viewBox="0 0 760 370"
      role="img"
      aria-label="Árbol real entrenado con el Titanic: 3 niveles de preguntas sobre clase y edad"
    >
      {/* ── CONEXIONES: Raíz a Nivel 1 ───────────────────────── */}
      <path
        d={`M ${rootX} 48 V 74 H ${l1X[0]} V 104 M ${rootX} 74 H ${l1X[1]} V 104`}
        className="tree-line"
      />
      <text x={rootX - 100} y="68" className="branch-note">
        SÍ
      </text>
      <text x={rootX + 100} y="68" className="branch-note">
        NO (3ª clase)
      </text>

      {/* ── CONEXIONES: Nivel 1 a Nivel 2 ─────────────────────── */}
      {/* Rama Izquierda */}
      <path
        d={`M ${l1X[0]} 134 V 158 H ${l2X[0]} V 186 M ${l1X[0]} 158 H ${l2X[1]} V 186`}
        className="tree-line"
      />
      <text x={l1X[0] - 44} y="152" className="branch-note">
        SÍ
      </text>
      <text x={l1X[0] + 44} y="152" className="branch-note">
        NO
      </text>

      {/* Rama Derecha */}
      <path
        d={`M ${l1X[1]} 134 V 158 H ${l2X[2]} V 186 M ${l1X[1]} 158 H ${l2X[3]} V 186`}
        className="tree-line"
      />
      <text x={l1X[1] - 44} y="152" className="branch-note">
        SÍ
      </text>
      <text x={l1X[1] + 44} y="152" className="branch-note">
        NO
      </text>

      {/* ── CONEXIONES: Nivel 2 a Hojas (Nivel 3) ─────────────── */}
      {/* N2-0 */}
      <path
        d={`M ${l2X[0]} 216 V 242 H ${leavesX[0]} V 274 M ${l2X[0]} 242 H ${leavesX[1]} V 274`}
        className="tree-line"
      />
      <text x={l2X[0] - 22} y="238" className="branch-note">
        SÍ
      </text>
      <text x={l2X[0] + 22} y="238" className="branch-note">
        NO
      </text>

      {/* N2-1 */}
      <path
        d={`M ${l2X[1]} 216 V 242 H ${leavesX[2]} V 274 M ${l2X[1]} 242 H ${leavesX[3]} V 274`}
        className="tree-line"
      />
      <text x={l2X[1] - 22} y="238" className="branch-note">
        SÍ
      </text>
      <text x={l2X[1] + 22} y="238" className="branch-note">
        NO
      </text>

      {/* N2-2 */}
      <path
        d={`M ${l2X[2]} 216 V 242 H ${leavesX[4]} V 274 M ${l2X[2]} 242 H ${leavesX[5]} V 274`}
        className="tree-line"
      />
      <text x={l2X[2] - 22} y="238" className="branch-note">
        SÍ
      </text>
      <text x={l2X[2] + 22} y="238" className="branch-note">
        NO
      </text>

      {/* N2-3 */}
      <path
        d={`M ${l2X[3]} 216 V 242 H ${leavesX[6]} V 274 M ${l2X[3]} 242 H ${leavesX[7]} V 274`}
        className="tree-line"
      />
      <text x={l2X[3] - 22} y="238" className="branch-note">
        SÍ
      </text>
      <text x={l2X[3] + 22} y="238" className="branch-note">
        NO
      </text>

      {/* ── NODOS: Raíz (Nivel 0) ─────────────────────────────── */}
      <g className="tree-label main">
        <rect x={rootX - 90} y="18" width="180" height="30" rx="3" />
        <text x={rootX} y="37">
          Clase ≤ 2 (1ª o 2ª clase)
        </text>
      </g>

      {/* ── NODOS: Nivel 1 (2 nodos) ─────────────────────────── */}
      <g className="tree-label">
        <rect x={l1X[0] - 56} y="104" width="112" height="30" rx="3" />
        <text x={l1X[0]} y="123">
          Edad ≤ 15.5
        </text>
      </g>
      <g className="tree-label">
        <rect x={l1X[1] - 52} y="104" width="104" height="30" rx="3" />
        <text x={l1X[1]} y="123">
          Edad ≤ 5.5
        </text>
      </g>

      {/* ── NODOS: Nivel 2 (4 nodos) ─────────────────────────── */}
      <g className="tree-label">
        <rect x={l2X[0] - 42} y="186" width="84" height="30" rx="3" />
        <text x={l2X[0]} y="205">
          Clase = 1ª
        </text>
      </g>
      <g className="tree-label">
        <rect x={l2X[1] - 42} y="186" width="84" height="30" rx="3" />
        <text x={l2X[1]} y="205">
          Clase = 1ª
        </text>
      </g>
      <g className="tree-label">
        <rect x={l2X[2] - 44} y="186" width="88" height="30" rx="3" />
        <text x={l2X[2]} y="205">
          Edad ≤ 1.5
        </text>
      </g>
      <g className="tree-label">
        <rect x={l2X[3] - 46} y="186" width="92" height="30" rx="3" />
        <text x={l2X[3]} y="205">
          Edad ≤ 32.5
        </text>
      </g>

      {/* ── HOJAS FINALES (Nivel 3: 8 hojas) ──────────────────── */}
      {leaves.map((leaf, index) => {
        const color = leaf.survives ? "#b5704f" : "#5d554e";
        return (
          <g className="tree-result" key={index}>
            <line
              x1={leaf.x - 32}
              y1="288"
              x2={leaf.x + 32}
              y2="288"
              stroke={color}
              strokeWidth="1.2"
            />
            <text
              x={leaf.x}
              y="308"
              textAnchor="middle"
              fill={color}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "13px",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              {leaf.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Interactive elements
   ═══════════════════════════════════════════════════════════════ */

function RegressionCalculator() {
  const [hours, setHours] = useState(5);
  const result = 50 + 5 * hours;

  return (
    <div className="calculator">
      <div className="calculator-header">
        <p className="overline" style={{ color: "#b5704f" }}>
          CALCULADORA INTERACTIVA
        </p>
        <h3>Predice tu calificación</h3>
      </div>
      <div className="calculator-body">
        <div className="slider-group">
          <label htmlFor="hours-slider">Horas de estudio</label>
          <div className="slider-value">{hours}h</div>
          <input
            id="hours-slider"
            type="range"
            min="0"
            max="10"
            step="1"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          <div className="slider-labels">
            <span>0h</span>
            <span>5h</span>
            <span>10h</span>
          </div>
        </div>
        <div className="calculator-result">
          <p className="formula">
            Y = 50 + 5 × <strong>{hours}</strong> ={" "}
            <strong className="accent">{result}</strong>
          </p>
          <div className="result-big">
            <strong>{result}</strong>
            <span>puntos</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PassengerCards() {
  const [selected, setSelected] = useState<number | null>(null);

  const passengers = [
    { age: 8, pclass: "1ª clase", survives: true },
    { age: 25, pclass: "3ª clase", survives: false },
    { age: 40, pclass: "2ª clase", survives: false },
    { age: 65, pclass: "3ª clase", survives: false },
  ];

  return (
    <div className="passenger-section">
      <p className="overline" style={{ color: "#b5704f" }}>
        PREDICCIONES DEL MODELO
      </p>
      <h3>Pasajeros nuevos</h3>
      <div className="passenger-grid">
        {passengers.map((p, i) => (
          <button
            key={i}
            className={`passenger-card${selected === i ? " selected" : ""}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <div className="passenger-info">
              <strong>{p.age} años</strong>
              <span>{p.pclass}</span>
            </div>
            <span className={`passenger-badge ${p.survives ? "positive" : "negative"}`}>
              {p.survives ? "Sobrevive" : "No sobrevive"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Pages / Sections
   ═══════════════════════════════════════════════════════════════ */

function HeroPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="hero-meta">
          <p className="overline">FUNDAMENTOS DE CIENCIA DE DATOS</p>
          <span>Una guía visual en tres actos</span>
        </div>
        <h1>
          Datos que explican,
          <br />
          <em>predicen</em> y deciden.
        </h1>
        <div className="hero-footer">
          <p>
            Del dato crudo a una decisión informada: tres procesos esenciales para comprender cómo
            se prepara, se interpreta y se transforma la información.
          </p>
          <button onClick={() => onNavigate("etl")} className="hero-cta">
            Comenzar la lectura
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <span className="hero-folio">01 — 03</span>
      </section>

      <div className="editorial-rule">
        <span>PREPARAR</span>
        <span>PREDECIR</span>
        <span>DECIDIR</span>
      </div>

      <div className="menu-cards">
        <button className="menu-card" onClick={() => onNavigate("etl")}>
          <span className="menu-card-number">01</span>
          <div>
            <p className="overline">PREPARAR EL DATO</p>
            <h3>
              Proceso <em>ETL</em>
            </h3>
          </div>
          <p>
            Reúne información desde distintas fuentes, la limpia y la organiza antes de llevarla a
            un destino listo para el análisis.
          </p>
          <span className="menu-card-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <button className="menu-card" onClick={() => onNavigate("regresion")}>
          <span className="menu-card-number">02</span>
          <div>
            <p className="overline">INTERPRETAR LA TENDENCIA</p>
            <h3>
              Regresión <em>lineal</em>
            </h3>
          </div>
          <p>
            Describe la relación entre una variable objetivo y los factores que pueden explicarla
            para estimar resultados no observados.
          </p>
          <span className="menu-card-arrow" aria-hidden="true">
            →
          </span>
        </button>
        <button className="menu-card" onClick={() => onNavigate("arboles")}>
          <span className="menu-card-number">03</span>
          <div>
            <p className="overline">EXPLICAR LA DECISIÓN</p>
            <h3>
              Árboles de <em>decisión</em>
            </h3>
          </div>
          <p>
            Organiza preguntas sucesivas hasta llegar a una respuesta, haciendo visible el
            razonamiento que conduce al resultado.
          </p>
          <span className="menu-card-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </>
  );
}

/* ── Section 01 · ETL ────────────────────────────────────────── */

function EtlSection() {
  return (
    <section className="topic">
      <FadeIn>
        <div className="topic-intro">
          <div className="display-number" aria-hidden="true">
            01
          </div>
          <div className="topic-heading">
            <p className="overline">PREPARAR EL DATO</p>
            <h2>
              Proceso <em>ETL</em>
            </h2>
          </div>
          <div className="definition">
            <p className="overline">¿QUÉ ES?</p>
            <p>
              ETL es el proceso de extraer datos de distintas fuentes, transformarlos para asegurar
              su calidad y cargarlos en un destino listo para el análisis.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="callout">
          <p className="overline" style={{ color: "#b5704f" }}>
            IDEA CLAVE
          </p>
          <p>La calidad del análisis depende de la calidad del dato que entra.</p>
        </div>
      </FadeIn>

      <FadeIn delay={180}>
        <div className="key-points">
          <article>
            <div className="point-meta">
              <span>01</span>
              <span>EXTRACCIÓN</span>
            </div>
            <h3>Extracción</h3>
            <p>
              Se leen los datos del archivo de ventas (CSV) con pandas: 244 registros y 9 columnas.
            </p>
          </article>
          <article>
            <div className="point-meta">
              <span>02</span>
              <span>TRANSFORMACIÓN</span>
            </div>
            <h3>Transformación</h3>
            <p>
              Se eliminan 4 duplicados, se tratan 16 valores nulos, se corrigen valores incorrectos
              y se unifica el formato de textos y fechas.
            </p>
          </article>
          <article>
            <div className="point-meta">
              <span>03</span>
              <span>CARGA</span>
            </div>
            <h3>Carga</h3>
            <p>Los datos limpios se guardan en un nuevo archivo: ventas_limpias.csv.</p>
          </article>
        </div>
      </FadeIn>

      <FadeIn delay={260}>
        <div className="visual">
          <div className="chart-area">
            <div className="chart-heading">
              <div>
                <p className="overline">LECTURA VISUAL</p>
                <h3>Ventas por categoría</h3>
              </div>
              <p>Resultado del dataset de ventas ya limpio.</p>
            </div>
            <EtlBarChart />
          </div>
          <aside className="figures">
            <p className="overline">CIFRAS DESTACADAS</p>
            <div>
              <div className="figure">
                <strong>244</strong>
                <span>registros originales</span>
              </div>
              <div className="figure">
                <strong>4</strong>
                <span>duplicados eliminados</span>
              </div>
              <div className="figure">
                <strong>16</strong>
                <span>valores nulos tratados</span>
              </div>
            </div>
          </aside>
        </div>
      </FadeIn>
    </section>
  );
}

/* ── Section 02 · Regresión lineal ───────────────────────────── */

function RegressionSection() {
  return (
    <section className="topic">
      <FadeIn>
        <div className="topic-intro">
          <div className="display-number" aria-hidden="true">
            02
          </div>
          <div className="topic-heading">
            <p className="overline">INTERPRETAR LA TENDENCIA</p>
            <h2>
              Regresión <em>lineal</em>
            </h2>
          </div>
          <div className="definition">
            <p className="overline">¿QUÉ ES?</p>
            <p>
              Método estadístico que analiza la relación entre una variable independiente (X) y una
              dependiente (Y) para encontrar la línea recta que mejor describe cómo cambia una en
              función de la otra. Ecuación: Y&nbsp;=&nbsp;a&nbsp;+&nbsp;bX, donde <em>a</em> es el
              intercepto y <em>b</em> la pendiente.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="key-points">
          <article>
            <div className="point-meta">
              <span>01</span>
              <span>VARIABLE X</span>
            </div>
            <h3>Independiente</h3>
            <p>
              Horas de estudio: el factor que se modifica para observar su efecto sobre la
              calificación.
            </p>
          </article>
          <article>
            <div className="point-meta">
              <span>02</span>
              <span>VARIABLE Y</span>
            </div>
            <h3>Dependiente</h3>
            <p>
              Calificación: el resultado que se quiere predecir a partir del tiempo invertido en
              estudio.
            </p>
          </article>
          <article>
            <div className="point-meta">
              <span>03</span>
              <span>MODELO</span>
            </div>
            <h3>Y = 50 + 5X</h3>
            <p>
              La ecuación describe cómo cada hora adicional de estudio modifica la calificación
              esperada.
            </p>
          </article>
        </div>
      </FadeIn>

      <FadeIn delay={250}>
        <div className="visual">
          <div className="chart-area">
            <div className="chart-heading">
              <div>
                <p className="overline">LECTURA VISUAL</p>
                <h3>Horas de estudio y calificación</h3>
              </div>
              <p>Una relación lineal perfecta sobre 8 observaciones.</p>
            </div>
            <RegressionScatterChart />
          </div>
          <aside className="figures">
            <p className="overline">CIFRAS DESTACADAS</p>
            <div>
              <div className="figure">
                <strong>5</strong>
                <span>pendiente</span>
              </div>
              <div className="figure">
                <strong>50</strong>
                <span>intercepto</span>
              </div>
              <div className="figure">
                <strong>95</strong>
                <span>predicción con 9 horas</span>
              </div>
            </div>
          </aside>
        </div>
      </FadeIn>

      <FadeIn delay={320}>
        <div className="callout">
          <p className="overline" style={{ color: "#b5704f" }}>
            INTERPRETACIÓN
          </p>
          <p>
            Por cada hora adicional de estudio, la calificación sube 5 puntos. Sin estudiar, la
            calificación esperada es 50.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={380}>
        <RegressionCalculator />
      </FadeIn>
    </section>
  );
}

/* ── Section 03 · Árboles de decisión ────────────────────────── */

function DecisionTreeSection() {
  return (
    <section className="topic">
      <FadeIn>
        <div className="topic-intro">
          <div className="display-number" aria-hidden="true">
            03
          </div>
          <div className="topic-heading">
            <p className="overline">EXPLICAR LA DECISIÓN</p>
            <h2>
              Árboles de <em>decisión</em>
            </h2>
          </div>
          <div className="definition">
            <p className="overline">¿QUÉ ES?</p>
            <p>
              Modelo de aprendizaje supervisado que toma decisiones haciendo preguntas sobre los
              datos, una tras otra, hasta llegar a un resultado. Sirve para clasificación (predecir
              una categoría) y regresión (predecir un número).
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={120}>
        <div className="key-points">
          <article>
            <div className="point-meta">
              <span>01</span>
              <span>INICIO</span>
            </div>
            <h3>Nodo raíz</h3>
            <p>
              La primera pregunta que divide todos los datos en dos grupos según la característica
              más informativa.
            </p>
          </article>
          <article>
            <div className="point-meta">
              <span>02</span>
              <span>RECORRIDO</span>
            </div>
            <h3>Ramas</h3>
            <p>Las respuestas posibles que conducen a nuevas preguntas, profundizando en los datos.</p>
          </article>
          <article>
            <div className="point-meta">
              <span>03</span>
              <span>RESULTADO</span>
            </div>
            <h3>Hojas</h3>
            <p>El resultado final cuando no quedan más preguntas por hacer en esa ruta.</p>
          </article>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="comparison-grid">
          <div className="comparison-card">
            <p className="overline" style={{ color: "#b5704f" }}>
              ÁRBOL DE DECISIÓN
            </p>
            <ul>
              <li>Divide los datos con preguntas y reglas</li>
              <li>Capta relaciones no lineales</li>
              <li>Sirve para clasificar y predecir números</li>
            </ul>
          </div>
          <div className="comparison-card">
            <p className="overline">REGRESIÓN LINEAL</p>
            <ul>
              <li>Ajusta una línea recta a los datos</li>
              <li>Asume relación lineal entre variables</li>
              <li>Solo predice valores numéricos</li>
            </ul>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={260}>
        <div className="data-banner">
          <p className="overline" style={{ color: "#b5704f" }}>
            EJEMPLO: TITANIC
          </p>
          <p className="data-banner-desc">
            Predecir si un pasajero sobrevivió usando edad y clase.
          </p>
          <div className="data-stats">
            <span>
              <strong>714</strong> registros
              <small> (177 sin edad removidos)</small>
            </span>
            <span>
              <strong>499</strong> entrenamiento (70%)
            </span>
            <span>
              <strong>215</strong> prueba (30%)
            </span>
            <span>
              <strong>max_depth = 3</strong>
            </span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={320}>
        <div className="visual">
          <div className="chart-area">
            <div className="chart-heading">
              <div>
                <p className="overline">LECTURA VISUAL</p>
                <h3>Estructura del modelo</h3>
              </div>
              <p>Árbol real entrenado con el Titanic: 3 niveles de preguntas sobre clase y edad.</p>
            </div>
            <DecisionTreeChart />
          </div>
          <aside className="figures">
            <p className="overline">CIFRAS DESTACADAS</p>
            <div>
              <div className="figure">
                <strong>68.37%</strong>
                <span>exactitud</span>
              </div>
              <div className="figure">
                <strong>3</strong>
                <span>niveles</span>
              </div>
              <div className="figure">
                <strong>8</strong>
                <span>nodos terminales</span>
              </div>
            </div>
          </aside>
        </div>
      </FadeIn>

      <FadeIn delay={380}>
        <div className="callout">
          <p className="overline" style={{ color: "#b5704f" }}>
            CONCLUSIÓN
          </p>
          <p>
            El modelo acierta en 68% de los casos. No es más alto porque solo usa edad y clase;
            faltan variables importantes como el sexo.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={440}>
        <PassengerCards />
      </FadeIn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   App
   ═══════════════════════════════════════════════════════════════ */

export default function App() {
  const [activePage, setActivePage] = useState<Page>("menu");

  const navigate = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <header className="site-header">
        <a
          className="wordmark"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("menu");
          }}
          aria-label="Ir al inicio"
        >
          CIENCIA <i>/</i> DATOS
        </a>
        <nav aria-label="Temas principales">
          {navigation.map((item) => (
            <a
              key={item.id}
              href="#"
              className={activePage === item.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.id);
              }}
            >
              <span>{item.number}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <span className="edition">16/11/2026</span>
      </header>

      <main>
        <div className="page-transition" key={activePage}>
          {activePage === "menu" && <HeroPage onNavigate={navigate} />}
          {activePage === "etl" && <EtlSection />}
          {activePage === "regresion" && <RegressionSection />}
          {activePage === "arboles" && <DecisionTreeSection />}
        </div>
      </main>

      <footer>
        <a
          className="wordmark"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("menu");
          }}
        >
          CIENCIA <i>/</i> DATOS
        </a>
        <p>Una introducción visual a los fundamentos que convierten datos en conocimiento.</p>
        <a
          href="#"
          className="back-to-top"
          onClick={(e) => {
            e.preventDefault();
            navigate("menu");
          }}
        >
          VOLVER AL MENÚ ↑
        </a>
      </footer>
    </div>
  );
}
