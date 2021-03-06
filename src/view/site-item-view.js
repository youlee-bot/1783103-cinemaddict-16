import dayjs from 'dayjs';
import { minsToHours } from '../site-utils';
import AbstractView from './abstract-view';

const createItemTemplate = (movie) =>  {
  const activeButton = (status) => (status)?'film-card__controls-item--active':'';
  const cutDescription = (text) => {
    let finalText = text.slice(0,139);
    finalText+='...';
    return finalText;
  };

  return (`<article class="film-card" data-movie-index="${ movie.id }">
  <a class="film-card__link">
    <h3 class="film-card__title">${ movie.title }</h3>
    <p class="film-card__rating">${ movie.totalRating }</p>
    <p class="film-card__info">
      <span class="film-card__year">${ dayjs(movie.release.date).format('YYYY') }</span>
      <span class="film-card__duration">${ minsToHours(movie.runtime) }</span>
      <span class="film-card__genre"><span class="film-details__genre">${ (movie.genre[0]) }</span></span>
    </p>
    <img src="./${ movie.poster }" alt="" class="film-card__poster">
    <p class="film-card__description">${ cutDescription(movie.description) }</p>
    <span class="film-card__comments">${ movie.commentsIds.length } comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${ activeButton(movie.userDetails.watchlist) }" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${ activeButton(movie.userDetails.alreadyWatched) }" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${ activeButton(movie.userDetails.favorite) } " type="button">Mark as favorite</button>
  </div>
  </article>`);
};

export default class ItemView extends AbstractView{
  movie = null;

  constructor (movie) {
    super();
    this.movie = movie;
    this.setClickHandler();
  }

  get template () {
    return createItemTemplate(this.movie);
  }

  setClickCallback = (callback) => {
    this._callback.click = callback;
  }

  setWatchlistCallback = (callback) => {
    this._callback.watchlist = callback;
  }

  setWatchCallback = (callback) => {
    this._callback.watch = callback;
  }

  setFavoriteCallback = (callback) => {
    this._callback.favorite = callback;
  }

  setClickHandler = () => {
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    const clickedElement = evt.target;
    if(clickedElement.classList.contains ('film-card__controls-item--favorite')) {
      this._callback.favorite();
      clickedElement.classList.toggle('film-card__controls-item--active');
    } else if (clickedElement.classList.contains ('film-card__controls-item--mark-as-watched')) {
      this._callback.watch();
      clickedElement.classList.toggle('film-card__controls-item--active');
    } else if (clickedElement.classList.contains ('film-card__controls-item--add-to-watchlist')) {
      this._callback.watchlist();
      clickedElement.classList.toggle('film-card__controls-item--active');
    } else {
      this._callback.click();
    }
  }
}
