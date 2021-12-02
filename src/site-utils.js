//оборачивает жанры в тег span
export const genresWrapSpan = (content) => {
  let wrappedGenres = '';
  for (const value of content) {
    if (value !== undefined) {
      wrappedGenres += `<span class="film-details__genre">${ value }</span>`;
    }
  }
  return wrappedGenres;
};
