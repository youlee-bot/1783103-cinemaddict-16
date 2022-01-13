import { FilterType } from './const';

export const genresWrapSpan = (content) => {
  let wrappedGenres = '';
  for (const value of content) {
    if (value !== undefined) {
      wrappedGenres += `<span class="film-details__genre">${ value }</span>`;
    }
  }
  return wrappedGenres;
};

export const filter = {
  [FilterType.ALL]: (movies) => (movies),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.userDetails.favorite),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
};
