import type { Article, BreakingItem, CategorySlug } from "@/lib/types/article";

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();

export const articles: Article[] = [
  {
    slug: "megaproyecto-millonario-sin-estudios",
    category: "politica",
    publishedAt: hoursAgo(1),
    headline:
      "Megaproyecto millonario sin estudios, sin licitación y sin pena",
    summary:
      "Un puente, dos carreteras y cero estudios de impacto ambiental. El proyecto promete conectar dos provincias que ya estaban conectadas.",
    factualSummary:
      "El gobierno anunció un megaproyecto de infraestructura valorado en ₡450.000 millones que incluye un puente y ampliación vial. Organizaciones ambientalistas cuestionan la ausencia de estudios de impacto y el proceso de contratación directa.",
    whyItMatters:
      "Proyectos de esta magnitud definen cómo se mueve el país durante años. Sin estudios ni licitación, el costo y el impacto ambiental recaen en todos los contribuyentes.",
    commentary:
      "Claro, porque cuando el presupuesto es grande, los estudios son opcionales y la licitación es de adorno. Promesa en construcción, entrega algún día.",
    donZopiQuote:
      "No es que el país esté mal, es que lo manejan como si fuera finca familiar.",
    sourceUrl: "https://www.nacion.com/ejemplo/megaproyecto",
    sourceName: "La Nación",
    heroImage: "/mock/hero-bridge.svg",
    viewCount: 120_000,
    featured: true,
  },
  {
    slug: "inundaciones-san-jose-drenajes",
    category: "costa-rica",
    publishedAt: hoursAgo(3),
    headline: "San José se convierte en Venecia tica por tercera vez este mes",
    summary:
      "Las lluvias dejaron avenidas convertidas en ríos. El MOPT dice que 'están en eso' desde 2018.",
    factualSummary:
      "Fuertes lluvias causaron inundaciones en varias avenidas de San José. Autoridades reportaron cierres temporales y daños en comercios. El MOPT indicó que hay proyectos de drenaje en planificación.",
    whyItMatters:
      "Las inundaciones en la capital afectan el comercio, el tránsito y la vida diaria de cientos de miles de personas. El retraso en obras de drenaje significa que el problema se repite temporada tras temporada.",
    commentary:
      "Tercera vez este mes. A este paso vendemos kayaks en la Sabana y nadie se sorprende.",
    donZopiQuote:
      "El drenaje es como el gym: todos saben que hay que ir, pero nadie va.",
    sourceUrl: "https://www.crhoy.com/ejemplo/inundaciones",
    sourceName: "CRHoy",
    heroImage: "/mock/hero-flood.svg",
    viewCount: 89_000,
  },
  {
    slug: "elecciones-mundo-incertidumbre",
    category: "mundo",
    publishedAt: hoursAgo(5),
    headline: "Elecciones en el extranjero: incertidumbre, encuestas y memes",
    summary:
      "Medio mundo vota y la otra mitad opina en redes. Spoiler: nadie está de acuerdo con nadie.",
    factualSummary:
      "Varios países celebran procesos electorales esta semana. Encuestas muestran resultados reñidos y alta participación en debates televisados.",
    whyItMatters:
      "Lo que pasa en otras democracias afecta comercio, migración y política exterior que impactan directamente a Costa Rica.",
    commentary:
      "Democracia en vivo: todos gritan, nadie escucha, y al final ganan los que mejor editan el clip de 15 segundos.",
    donZopiQuote:
      "La política internacional es como WhatsApp familiar: mucho drama, poca solución.",
    sourceUrl: "https://www.bbc.com/ejemplo/elecciones",
    sourceName: "BBC Mundo",
    heroImage: "/mock/hero-ballot.svg",
    viewCount: 67_000,
  },
  {
    slug: "teatro-nacional-temporada-satirica",
    category: "cultura",
    publishedAt: hoursAgo(8),
    headline:
      "Teatro Nacional abre temporada de sátira política (sin permiso de nadie)",
    summary:
      "Obras que se ríen del poder. Entradas agotadas en horas. Políticos 'ocupados' esa noche.",
    factualSummary:
      "El Teatro Nacional anunció una temporada dedicada a obras de sátira política. Las entradas para la función inaugural se agotaron en menos de cuatro horas.",
    whyItMatters:
      "La demanda refleja un apetito público por espacios donde se cuestione el poder con humor, algo cada vez más escaso en el debate político local.",
    commentary:
      "Cuando la sátira llena teatros y la política llena memes, algo estamos haciendo bien. O mal. Probablemente ambos.",
    donZopiQuote:
      "El arte es el único lugar donde la verdad no necesita permiso de la Asamblea.",
    sourceUrl: "https://www.nacion.com/ejemplo/teatro",
    sourceName: "La Nación",
    heroImage: "/mock/hero-theater.svg",
    viewCount: 34_000,
  },
  {
    slug: "diputado-propone-ley-leyes",
    category: "politica",
    publishedAt: hoursAgo(12),
    headline: "Diputado propone ley para regular cuántas leyes se pueden proponer",
    summary:
      "La ironía no es accidental. El proyecto tiene 47 artículos y cero estudios de fiscalización.",
    factualSummary:
      "Un diputado presentó un proyecto de ley que busca limitar la cantidad de iniciativas legislativas por período. Colegas de distintos bloques expresaron opiniones divididas.",
    whyItMatters:
      "La Asamblea Legislativa aprueba pocas leyes pero presenta miles de proyectos. Cualquier reforma al ritmo legislativo afecta cómo se gobierna el país.",
    commentary:
      "Una ley sobre leyes. Meta nivel legislatura. Próximo paso: comisión para estudiar comisiones.",
    donZopiQuote:
      "En la Asamblea la productividad se mide en proyectos presentados, no en proyectos aprobados.",
    sourceUrl: "https://www.diarioextra.com/ejemplo/ley-leyes",
    sourceName: "Diario Extra",
    heroImage: "/mock/hero-asamblea.svg",
    viewCount: 95_000,
  },
  {
    slug: "precio-huevos-record",
    category: "costa-rica",
    publishedAt: hoursAgo(18),
    headline: "El huevo alcanza precio récord y el gallo pide aumento",
    summary:
      "Canasta básica sigue subiendo. Economistas hablan de inflación; la gente habla de almuerzo sin huevo.",
    factualSummary:
      "El precio del cartón de huevos alcanzó un nuevo máximo histórico según datos del MEIC. Analistas señalan factores de costos de producción y cadena de suministro.",
    whyItMatters:
      "El huevo es pilar de la canasta básica tica. Cuando sube de precio, el impacto se siente en la mesa de las familias de menores ingresos.",
    commentary:
      "Cuando el desayuno tico cuesta como cena en San Pedro, algo huele mal. Y no es el gallo pinto.",
    donZopiQuote:
      "La canasta básica ya no es básica; es aspiracional.",
    sourceUrl: "https://www.elfinancierocr.com/ejemplo/huevos",
    sourceName: "El Financiero",
    heroImage: "/mock/hero-eggs.svg",
    viewCount: 78_000,
  },
  {
    slug: "ovni-reportado-cartago",
    category: "que-desastre",
    publishedAt: hoursAgo(24),
    headline: "Reportan ovni en Cartago; expertos dicen que era un globo de cumpleaños",
    summary:
      "Redes explotaron con teorías. NASA no comentó. El cumpleañero sí.",
    factualSummary:
      "Decenas de personas reportaron ver un objeto luminoso sobre Cartago. Astrónomos locales indicaron que probablemente se trataba de un globo con luces LED arrastrado por viento.",
    whyItMatters:
      "La desinformación en redes se propaga más rápido que la verificación. Casos así muestran lo fácil que es confundir un fenómeno común con algo extraordinario.",
    commentary:
      "De contacto extraterrestre a fiesta de quince años en 48 horas. Costa Rica no decepciona.",
    donZopiQuote:
      "Antes de invocar aliens, siempre revise si hay piñata cerca.",
    sourceUrl: "https://www.teletica.com/ejemplo/ovni",
    sourceName: "Teletica",
    heroImage: "/mock/hero-ufo.svg",
    viewCount: 156_000,
  },
  {
    slug: "columna-opinion-burocracia",
    category: "opinion",
    publishedAt: hoursAgo(30),
    headline: "Opinión: la burocracia tica es un deporte de resistencia",
    summary:
      "Trámites, filas y formularios. Un ensayo sobre por qué un PDF requiere tres sellos y una paciencia infinita.",
    factualSummary:
      "Columna de opinión sobre los tiempos de trámites gubernamentales en Costa Rica, citando datos de tiempos promedio de respuesta en instituciones públicas.",
    whyItMatters:
      "Los trámites lentos cuestan tiempo y dinero a ciudadanos y empresas. Mejorar la eficiencia del Estado es clave para la competitividad del país.",
    commentary:
      "No es burocracia, es entrenamiento olímpico para la paciencia. Medalla de oro en trámite 3 en 1.",
    donZopiQuote:
      "El trámite más rápido es el que otro hace por vos.",
    sourceUrl: "https://www.nacion.com/ejemplo/burocracia",
    sourceName: "La Nación",
    heroImage: "/mock/hero-paperwork.svg",
    viewCount: 41_000,
  },
  {
    slug: "cambio-climico-playas-erosion",
    category: "mundo",
    publishedAt: hoursAgo(36),
    headline: "Informe global alerta por erosión costera en América Latina",
    summary:
      "El mar sube, las playas retroceden y los planes de adaptación siguen en PowerPoint.",
    factualSummary:
      "Un informe internacional documenta aceleración de erosión costera en la región. Expertos recomiendan políticas de adaptación y protección de ecosistemas marino-costeros.",
    whyItMatters:
      "Costa Rica depende del turismo costero y la pesca. La erosión amenaza comunidades, infraestructura y la economía de zonas enteras del Pacífico y el Caribe.",
    commentary:
      "PowerPoint contra el océano. Spoiler: el océano va ganando.",
    donZopiQuote:
      "Planificar a futuro es gratis; ejecutar cuesta. Por eso solo hacemos lo primero.",
    sourceUrl: "https://www.reuters.com/ejemplo/erosion",
    sourceName: "Reuters",
    heroImage: "/mock/hero-coast.svg",
    viewCount: 52_000,
  },
  {
    slug: "festival-musica-tickets-agotados",
    category: "cultura",
    publishedAt: hoursAgo(48),
    headline: "Festival de música agota entradas en 7 minutos (bots sospechados)",
    summary:
      "Fans en fila virtual. Revendedores en fila real. Organizadores 'investigando'.",
    factualSummary:
      "Un festival de música de gran convocatoria agotó entradas en minutos. Usuarios reportaron dificultades en la plataforma y presencia de revendedores en redes sociales.",
    whyItMatters:
      "El acceso equitativo a eventos culturales es un tema recurrente. Bots y reventa dejan afuera a quienes no pueden pagar precios inflados.",
    commentary:
      "Siete minutos. Ni el INA aprueba trámites tan rápido. Los bots sí tienen pase VIP.",
    donZopiQuote:
      "La cultura es de todos, excepto cuando hay que comprar entrada.",
    sourceUrl: "https://www.lateja.cr/ejemplo/festival",
    sourceName: "La Teja",
    heroImage: "/mock/hero-festival.svg",
    viewCount: 63_000,
  },
];

export const breakingNews: BreakingItem[] = [
  {
    slug: "megaproyecto-millonario-sin-estudios",
    headline: "Megaproyecto millonario genera polémica por falta de estudios",
    publishedAt: hoursAgo(0.5),
  },
  {
    slug: "inundaciones-san-jose-drenajes",
    headline: "Inundaciones afectan comercios en el centro de San José",
    publishedAt: hoursAgo(2),
  },
  {
    slug: "precio-huevos-record",
    headline: "Precio del huevo alcanza nuevo récord según MEIC",
    publishedAt: hoursAgo(4),
  },
  {
    slug: "ovni-reportado-cartago",
    headline: "Reportes de objeto luminoso en Cartago generan debate",
    publishedAt: hoursAgo(6),
  },
  {
    slug: "diputado-propone-ley-leyes",
    headline: "Nuevo proyecto busca limitar cantidad de leyes por período",
    publishedAt: hoursAgo(8),
  },
];

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) ?? articles[0];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: CategorySlug): Article[] {
  return articles.filter((a) => a.category === category);
}

export function getGridArticles(): Article[] {
  const featured = getFeaturedArticle();
  return articles.filter((a) => a.slug !== featured.slug).slice(0, 3);
}

export function getMostRead(): Article[] {
  return [...articles]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 5);
}

export function getFeaturedDonZopiQuote(): string {
  return getFeaturedArticle().donZopiQuote;
}

export function getAllSlugs(): string[] {
  return articles.map((a) => a.slug);
}
