import { RenderPosition, renderTemplate } from './render';
import { createSiteMenuTemplate } from './view/site-menu-view';
import { createItemTemplate } from './view/site-item-view';
import { createUserRatingTemplate } from './view/site-user-rating-view';
import { createSortTemplate } from './view/site-sort-view';
import { createShowMoreButtonTemplate } from './view/site-show-more-button-view';
import { createMoviesCounterTemplate } from './view/site-movies-counter-view';
import { createPopupTemplate } from './view/site-popup-view';
import { createExtraTemplate } from './view/site-extra-view';
import { readyContent } from './mock/generator';

const MOVIES_TO_SHOW = 5;
const MOVIES_TO_SHOW_PER_STEP = 5;
const EXTRA_COUNTER = 2;

let displayedMovieCards = 0;

const headerTag = document.querySelector('.header');
renderTemplate (headerTag, createUserRatingTemplate(), RenderPosition.BEFOREEND);

const mainTag = document.querySelector('.main');

mainTag.innerHTML = ('<section class="films"><section class="films-list"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div></section></section>');

renderTemplate (mainTag, createSortTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate (mainTag, createSiteMenuTemplate(), RenderPosition.AFTERBEGIN );


const filmListSection = mainTag.querySelector('.films');

const filmListContainer = mainTag.querySelector('.films-list__container');
const showMovieCard = (start, end) => {
  for (let i = start; i < end; i++) {
    renderTemplate (filmListContainer, createItemTemplate(readyContent[i]), RenderPosition.BEFOREEND);
    displayedMovieCards++;
  }
};
showMovieCard(0, MOVIES_TO_SHOW);

renderTemplate (filmListContainer, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

for (let i = 0; i < EXTRA_COUNTER; i++) {
  renderTemplate (filmListSection, createExtraTemplate(readyContent[i]), RenderPosition.BEFOREEND);
}

const footerTag = document.querySelector('.footer__statistics');
renderTemplate (footerTag, createMoviesCounterTemplate(readyContent.length), RenderPosition.BEFOREEND);
renderTemplate (footerTag, createPopupTemplate(0), RenderPosition.AFTEREND);

const showMoreButton = document.querySelector('.films-list__show-more');

const onShowMoreButtonClick = (evt) => {
  evt.preventDefault();
  if (readyContent.length > displayedMovieCards) {
    const hidedMovieCards = readyContent.length - displayedMovieCards;
    if (hidedMovieCards >= MOVIES_TO_SHOW_PER_STEP) {
      showMovieCard(displayedMovieCards - 1, displayedMovieCards-1 + MOVIES_TO_SHOW_PER_STEP);
    }
    if (hidedMovieCards < MOVIES_TO_SHOW_PER_STEP) {
      showMovieCard(displayedMovieCards - 1, readyContent.length - 1);
      document.querySelector('.films-list__show-more').remove();
    }
  }
};

showMoreButton.addEventListener('click', onShowMoreButtonClick);
