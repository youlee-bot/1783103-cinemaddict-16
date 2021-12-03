import {
  generateMovie
} from './movie';

import {
  generateComment
} from './comments';

let readyContent = [];
let readyComments = [];
const MOVIES_TO_GENERATE = 23;

const generateContent = (ammount) => {
  const generatedContentArray = [];
  let generatedMovies = 0;

  while (generatedMovies < ammount) {
    generatedContentArray.push(generateMovie(generatedMovies));
    generatedMovies++;
  }

  return generatedContentArray;
};

const generateComments = () => {
  const generatedComments = [];
  for (const element of readyContent) {
    if (element.comments > 0) {
      let generatedCommentsForCurrent = 0;
      while (generatedCommentsForCurrent < element.comments) {
        generatedComments.push(generateComment(element.id));
        generatedCommentsForCurrent++;
      }
    }
  }
  return generatedComments;
};

if ((readyContent.length === 0) && (readyComments.length === 0)) {
  readyContent = generateContent(MOVIES_TO_GENERATE).slice();
  readyComments = generateComments().slice();
}

export {
  readyContent,
  readyComments
};
