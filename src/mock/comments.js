import { LIST_OF_EMOTIONS, LIST_OF_NAMES, DESCRIPTIONS } from './constants';
import { generateRandomUniqueArray } from './utils';
import { getRandomInteger } from './utils';
import { gerenerateElement } from './utils';
import { generateDate } from './utils';

export const generateComment = (id) => (
  {
    movieId: id,
    author: gerenerateElement(LIST_OF_NAMES),
    comment: generateRandomUniqueArray(DESCRIPTIONS.split('.'), getRandomInteger(1,2)).join('.'),
    date: generateDate('2021-11-28T16:12:32.554Z').format(),
    emotion: gerenerateElement(LIST_OF_EMOTIONS)
  }
);

