import { RenderPosition, renderTemplate } from './render';
import { createSiteMenuTemplate } from './view/site-menu-view';
import { createItemTemplate } from './view/site-item-view';
import { createUserRatingTemplate } from './view/site-user-rating-view';
import { createSortTemplate } from './view/site-sort-view';
import { createShowMoreButtonTemplate } from './view/site-show-more-button-view';
import { createMoviesCounterTemplate } from './view/site-movies-counter-view';
import { createPopupTemplate } from './view/site-popup-view';
import { createExtraTemplate } from './view/site-extra-view';

const ITEMS_COUNTER = 5;
const EXTRA_COUNTER = 2;

const mainTag = document.querySelector('.main');
const headerTag = document.querySelector('.header');
const footerTag = document.querySelector('.footer__statistics');

mainTag.innerHTML = ('<div class="films-list__container"></div>');
renderTemplate (headerTag, createUserRatingTemplate(), RenderPosition.BEFOREEND);
renderTemplate (mainTag, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN );

const filmListContainer = mainTag.querySelector('.films-list__container');
renderTemplate (filmListContainer, createSortTemplate(), RenderPosition.BEFOREBEGIN);

for (let i = 0; i < ITEMS_COUNTER; i++) {
  renderTemplate (filmListContainer, createItemTemplate(), RenderPosition.BEFOREEND);
}

for (let i = 0; i < EXTRA_COUNTER; i++) {
  renderTemplate (filmListContainer, createExtraTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate (mainTag, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate (footerTag, createMoviesCounterTemplate(), RenderPosition.BEFOREEND)
renderTemplate (footerTag, createPopupTemplate(), RenderPosition.AFTEREND)

