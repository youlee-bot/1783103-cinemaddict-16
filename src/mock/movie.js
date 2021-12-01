import { generateRandomUniqueArray } from './utils';
import { getRandomInteger } from './utils';
import { gerenerateElement } from './utils';
import { LIST_OF_TITLES, LIST_OF_POSTERS, LIST_OF_AGE_RATING, LIST_OF_NAMES, LIST_OF_COUNTRES, LIST_OF_GENRES, DESCRIPTIONS  } from './constants';

const generateRating = () => (`${getRandomInteger(1,9)}.${getRandomInteger(0,9)}`);
import { generateDate } from './utils';

export const generateMovie = (id) => (
  {
    id: id,
    title: gerenerateElement(LIST_OF_TITLES),
    alternativeTitle: `Alternative ${  gerenerateElement(LIST_OF_TITLES)}`,
    totalRating: generateRating(),
    poster: `images/posters/${  gerenerateElement(LIST_OF_POSTERS)}`,
    ageRating: gerenerateElement(LIST_OF_AGE_RATING),
    director: gerenerateElement(LIST_OF_NAMES),
    writers: generateRandomUniqueArray(LIST_OF_NAMES, 1),
    actors: generateRandomUniqueArray(LIST_OF_NAMES, getRandomInteger(1,5)),
    release: {
      date: generateDate('1980-11-28T16:12:32.554Z').format(),
      releaseCountry: gerenerateElement(LIST_OF_COUNTRES)
    },
    runtime: getRandomInteger(40,120),
    genre: generateRandomUniqueArray(LIST_OF_GENRES, getRandomInteger(1,2)),
    description: generateRandomUniqueArray(DESCRIPTIONS.split('.'), getRandomInteger(1,5)).join('.'),
    comments: getRandomInteger(0,5),
  }
);

