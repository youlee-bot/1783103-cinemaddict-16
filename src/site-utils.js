import { readyComments } from './mock/generator';
import { createCommentTemplate } from './view/site-comment-view';

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

export const showComments = (movie) => {
  let movieComments = '';
  for (const index of readyComments) {
    if (index.movieId===movie) {
      movieComments += createCommentTemplate(index);
    }
  }
  return movieComments;
};
