import { genresWrapSpan } from '../site-utils';
import dayjs from 'dayjs';
import { minsToHours } from '../mock/utils';
import { createElement } from '../render';

const createItemTemplate = (movie) =>  (`<article class="film-card" data-movie-index="${ movie.id }">
  <a class="film-card__link">
    <h3 class="film-card__title">${ movie.title }</h3>
    <p class="film-card__rating">${ movie.totalRating }</p>
    <p class="film-card__info">
      <span class="film-card__year">${ dayjs(movie.release.date).format('YYYY') }</span>
      <span class="film-card__duration">${ minsToHours(movie.runtime) }</span>
      <span class="film-card__genre">${ genresWrapSpan(movie.genre) }</span>
    </p>
    <img src="./${ movie.poster }" alt="" class="film-card__poster">
    <p class="film-card__description">${ movie.description }</p>
    <span class="film-card__comments">${ movie.comments } comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
  </article>`);

export default class ItemView {
  #element = null;
  #movie = null;

  constructor (movie) {
    this.#movie = movie;
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);

    }
    return this.#element;
  }

  get template () {
    return createItemTemplate(this.#movie);
  }

  removeElement () {
    this.#element = null;
  }

}
