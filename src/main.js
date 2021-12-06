import { renderElement, RenderPosition } from './render';
import SiteMenuView from './view/site-menu-view';
import ItemView from './view/site-item-view';
import RatingView from './view/site-user-rating-view';
import SortView from './view/site-sort-view';
import ButtonView from './view/site-show-more-button-view';
import MoviesView from './view/site-movies-counter-view';
import PopupView from './view/site-popup-view';
//import { createExtraTemplate } from './view/site-extra-view';
import { readyComments, readyContent } from './mock/generator';
import ExtraView from './view/site-extra-view';

const MOVIES_TO_SHOW = 5;
const MOVIES_TO_SHOW_PER_STEP = 5;
const EXTRA_COUNTER = 2;

let displayedMovieCards = 0;

const headerTag = document.querySelector('.header');
renderElement (headerTag, new RatingView().element, RenderPosition.BEFOREEND);

const mainTag = document.querySelector('.main');

mainTag.innerHTML = ('<section class="films"><section class="films-list"><h2 class="films-list__title visually-hidden">All movies. Upcoming</h2><div class="films-list__container"></div></section></section>');

renderElement (mainTag, new SortView().element, RenderPosition.AFTERBEGIN);
renderElement (mainTag, new SiteMenuView().element, RenderPosition.AFTERBEGIN );


const filmListSection = mainTag.querySelector('.films');

const filmListContainer = mainTag.querySelector('.films-list__container');
const showMovieCard = (start, end) => {
  for (let i = start; i < end; i++) {
    renderElement (filmListContainer, new ItemView(readyContent[i]).element, RenderPosition.BEFOREEND);
    displayedMovieCards++;
  }
};
showMovieCard(0, MOVIES_TO_SHOW);

renderElement (filmListContainer, new ButtonView().element, RenderPosition.AFTEREND);


for (let i = 0; i < EXTRA_COUNTER; i++) {
  renderElement (filmListSection, new ExtraView(readyContent[i]).element, RenderPosition.BEFOREEND);
}

const footerTag = document.querySelector('.footer__statistics');
renderElement (footerTag, new MoviesView(readyContent.length).element, RenderPosition.BEFOREEND);


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

const bodyTag = document.querySelector('body');

const onMovieCardClick = (evt) => {
  evt.preventDefault();

  const prepareComments = (movieId) => {
    const movieComments = [];
    for (const index of readyComments) {
      if (index.movieId===movieId) {
        movieComments.push(index);
      }
    }
    return movieComments;
  };

  const parentTag = evt.target.closest('article');
  const idToShow = parseInt(parentTag.getAttribute('data-movie-index'),10);
  const popupClassInstance = new PopupView(readyContent[idToShow], prepareComments(idToShow));

  const closePopup = () => {
    const popupElement = document.querySelector('.film-details');
    if (popupElement) {
      bodyTag.removeChild(popupClassInstance.element);
      bodyTag.classList.remove('hide-overflow');
    }
  };

  if (parentTag) {
    closePopup();
    bodyTag.classList.add('hide-overflow');
    bodyTag.appendChild(popupClassInstance.element);

    const closeButton = popupClassInstance.element.querySelector('.film-details__close-btn');
    const onCloseButtonClick = () => {
      closePopup();
    };

    closeButton.addEventListener('click', onCloseButtonClick);
  }

};

filmListContainer.addEventListener('click', onMovieCardClick);
