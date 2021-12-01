import { readyContent } from '../main';
import dayjs from 'dayjs';
import { minsToHours } from '../mock/utils';

export const createItemTemplate = (movieId) => (`<article class="film-card">
<a class="film-card__link">
  <h3 class="film-card__title">${ readyContent[movieId].title }</h3>
  <p class="film-card__rating">${ readyContent[movieId].totalRating }</p>
  <p class="film-card__info">
    <span class="film-card__year">${ dayjs(readyContent[movieId].release.date).format('YYYY') }</span>
    <span class="film-card__duration">${ minsToHours(readyContent[movieId].runtime) }</span>
    <span class="film-card__genre">${ readyContent[movieId].genre }</span>
  </p>
  <img src="./${ readyContent[movieId].poster }" alt="" class="film-card__poster">
  <p class="film-card__description">${ readyContent[movieId].description }</p>
  <span class="film-card__comments">${ readyContent[movieId].comments } comments</span>
</a>
<div class="film-card__controls">
  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
</div>
</article>`);


//readyContent[movieId].release показать только год
//${ readyContent[movieId].runtime } 1h 1m
