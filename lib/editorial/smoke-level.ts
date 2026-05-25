export const smokeLevels = [
  "relax",
  "sospechoso",
  "estresando",
  "conferencia_eterna",
  "cinematic",
] as const;

export type SmokeLevel = (typeof smokeLevels)[number];

export function isSmokeLevel(value: string): value is SmokeLevel {
  return (smokeLevels as readonly string[]).includes(value);
}

const labels: Record<SmokeLevel, { emoji: string; label: string }> = {
  relax: { emoji: "🟢", label: "Relax" },
  sospechoso: { emoji: "🟡", label: "Sospechoso" },
  estresando: { emoji: "🟠", label: "Ya me estoy estresando" },
  conferencia_eterna: { emoji: "🔴", label: "Esto termina en conferencia eterna" },
  cinematic: { emoji: "☠️", label: "Costa Rica cinematic universe" },
};

export const smokeLevelImages: Record<SmokeLevel, string> = {
  relax: "/don-zopi/relax.png",
  sospechoso: "/don-zopi/sospechoso.png",
  estresando: "/don-zopi/estresando.png",
  conferencia_eterna: "/don-zopi/conferencia-eterna.png",
  cinematic: "/don-zopi/cinematic.png",
};

export interface SmokeLevelAsset {
  src: string;
  width: number;
  height: number;
}

export const smokeLevelAssets: Record<SmokeLevel, SmokeLevelAsset> = {
  relax: { src: smokeLevelImages.relax, width: 356, height: 214 },
  sospechoso: { src: smokeLevelImages.sospechoso, width: 466, height: 310 },
  estresando: { src: smokeLevelImages.estresando, width: 398, height: 204 },
  conferencia_eterna: {
    src: smokeLevelImages.conferencia_eterna,
    width: 464,
    height: 294,
  },
  cinematic: { src: smokeLevelImages.cinematic, width: 572, height: 314 },
};

export function getSmokeLevelImage(level: SmokeLevel): string {
  return smokeLevelImages[level];
}

export function getSmokeLevelAsset(level: SmokeLevel): SmokeLevelAsset {
  return smokeLevelAssets[level];
}

export function formatSmokeLevel(level: SmokeLevel): string {
  const { emoji, label } = labels[level];
  return `${emoji} ${label}`;
}

export const defaultSmokeLevel: SmokeLevel = "sospechoso";
