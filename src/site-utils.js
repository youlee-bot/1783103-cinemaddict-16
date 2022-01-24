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

export const minsToHours = (mins, stats=false) => {
  const hours = (mins / 60);
  const resultHours = Math.floor(hours);
  const minutes = (hours - resultHours) * 60;
  const resultMinutes = Math.round(minutes);
  if (stats===false) {
    if (resultHours === 0) {
      return `${resultMinutes  }m`;
    } else {
      return `${resultHours  }h ${  resultMinutes  }m`;
    }
  } else {
    if (resultHours === 0) {
      return `${resultMinutes  }<span class="statistic__item-description">m</span>`;
    } else {
      return `${resultHours  }<span class="statistic__item-description">h</span> ${  resultMinutes  }<span class="statistic__item-description">m</span>`;
    }
  }

};
