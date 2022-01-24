import dayjs from 'dayjs';
import { StatsType } from './const';
import { minsToHours } from './site-utils';

const filterDataForPeriod = (movies, startDate) => movies.filter((movie) => dayjs(movie.userDetails.watchingDate).isAfter(startDate));

export const getDataForPeriod = (data) => {
  let dataForPeriod = null;

  switch (data.statsType) {
    case (StatsType.ALL):
      dataForPeriod = data.movies;
      break;
    case StatsType.TODAY:
      dataForPeriod = filterDataForPeriod (data.movies, dayjs().startOf('day').toDate());
      break;
    case StatsType.WEEK:
      dataForPeriod = filterDataForPeriod (data.movies, dayjs().subtract(1, 'week').toDate());
      break;
    case StatsType.MONTH:
      dataForPeriod = filterDataForPeriod (data.movies, dayjs().subtract(1, 'month').toDate());
      break;
    case StatsType.YEAR:
      dataForPeriod = filterDataForPeriod (data.movies, dayjs().subtract(1, 'year').toDate());
      break;
  }
  return dataForPeriod;
};

export const settingsForChart = (data) => {
  const dataForPeriod = getDataForPeriod(data);

  const genres = new Set();
  const genresToCount = [];
  dataForPeriod.forEach((element) => {
    for (const elementIndex of element.genre) {
      genres.add(elementIndex);
      genresToCount.push(element.genre);
    }
  });

  const countGenreMovies = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  const genresCount = [];
  genres.forEach((genre) => {
    genresCount.push(countGenreMovies(genresToCount.join().split(','),genre));
  });

  return {genres: Array.from(genres), genresCount:genresCount, topGenre: Array.from(genres)[genresCount.indexOf( Math.max.apply(null, genresCount))],};
};

export const timeCount = (data) => {
  let timeInMinutes = null;
  data.forEach((element) => {
    timeInMinutes+=element.runtime;
  });

  return minsToHours(timeInMinutes);
};
