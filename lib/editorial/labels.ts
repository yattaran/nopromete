/** Título de la sección de comentario según el tono de la noticia. */
export function commentarySectionTitle(isPositiveNews: boolean): string {
  return isPositiveNews ? "La parte que promete" : "La parte que no promete";
}
