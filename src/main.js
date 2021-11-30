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

const headerTag = document.querySelector('.header');
renderTemplate (headerTag, createUserRatingTemplate(), RenderPosition.BEFOREEND);

const mainTag = document.querySelector('.main');

mainTag.innerHTML = ('<section class="films"><section class="films-list"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div></section></section>');

renderTemplate (mainTag, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate (mainTag, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN );


const filmListSection = mainTag.querySelector('.films');

const filmListContainer = mainTag.querySelector('.films-list__container');
for (let i = 0; i < ITEMS_COUNTER; i++) {
  renderTemplate (filmListContainer, createItemTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate (filmListContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

for (let i = 0; i < EXTRA_COUNTER; i++) {
  renderTemplate (filmListSection, createExtraTemplate(), RenderPosition.BEFOREEND);
}

const footerTag = document.querySelector('.footer__statistics');
renderTemplate (footerTag, createMoviesCounterTemplate(), RenderPosition.BEFOREEND)
renderTemplate (footerTag, createPopupTemplate(0), RenderPosition.AFTEREND)
