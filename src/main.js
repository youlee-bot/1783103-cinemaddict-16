import { render, RenderPosition, remove } from './render';
import SiteMenuView from './view/site-menu-view';
import ItemView from './view/site-item-view';
import RatingView from './view/site-user-rating-view';
import SortView from './view/site-sort-view';
import ButtonView from './view/site-show-more-button-view';
import MoviesView from './view/site-movies-counter-view';
import PopupView from './view/site-popup-view';
import { readyComments, readyContent } from './mock/generator';
import ExtraView from './view/site-extra-view';
import BoardView from './view/site-board-view';

const MOVIES_TO_SHOW = 5;
const MOVIES_TO_SHOW_PER_STEP = 5;
const EXTRA_COUNTER = 2;
let displayedMovieCards = 0;

const MoreButton = new ButtonView();

const headerTag = document.querySelector('.header');
render (headerTag, new RatingView(), RenderPosition.BEFOREEND);
const bodyTag = document.querySelector('body');
const mainTag = document.querySelector('.main');

render (mainTag, new BoardView(), RenderPosition.AFTERBEGIN);
render (mainTag, new SortView(), RenderPosition.AFTERBEGIN);
render (mainTag, new SiteMenuView(), RenderPosition.AFTERBEGIN );


const filmListSection = mainTag.querySelector('.films');

const filmListContainer = mainTag.querySelector('.films-list__container');
const showMovieCard = (start, end) => {
  for (let i = start; i < end; i++) {
    const currentMovie = new ItemView(readyContent[i]);
    render (filmListContainer, currentMovie, RenderPosition.BEFOREEND);
    currentMovie.setClickHandler(()=>{

      const prepareComments = (movieId) => {
        const movieComments = [];
        for (const index of readyComments) {
          if (index.movieId===movieId) {
            movieComments.push(index);
          }
        }
        return movieComments;
      };


      const idToShow = currentMovie.movie.id;
      const popupClassInstance = new PopupView(readyContent[idToShow], prepareComments(idToShow));

      const closePopup = () => {
        const popupElement = document.querySelector('.film-details');
        if (popupElement) {
          bodyTag.removeChild(popupClassInstance.element);
          bodyTag.classList.remove('hide-overflow');
        }
      };


      if (idToShow!== null) {
        closePopup();
        bodyTag.classList.add('hide-overflow');
        bodyTag.appendChild(popupClassInstance.element);

        const closeButton = popupClassInstance.element.querySelector('.film-details__close-btn');
        const onCloseButtonClick = () => {
          closePopup();
        };

        closeButton.addEventListener('click', onCloseButtonClick);
      }

    });
    displayedMovieCards++;
  }
};
showMovieCard(0, MOVIES_TO_SHOW);

render (filmListContainer, MoreButton, RenderPosition.AFTEREND);


for (let i = 0; i < EXTRA_COUNTER; i++) {
  render (filmListSection, new ExtraView(readyContent[i]), RenderPosition.BEFOREEND);
}

const footerTag = document.querySelector('.footer__statistics');
render (footerTag, new MoviesView(readyContent.length), RenderPosition.BEFOREEND);


MoreButton.setClickHandler(()=>{
  if (readyContent.length > displayedMovieCards) {
    const hidedMovieCards = readyContent.length - displayedMovieCards;
    if (hidedMovieCards >= MOVIES_TO_SHOW_PER_STEP) {
      showMovieCard(displayedMovieCards - 1, displayedMovieCards-1 + MOVIES_TO_SHOW_PER_STEP);
    }
    if (hidedMovieCards < MOVIES_TO_SHOW_PER_STEP) {
      showMovieCard(displayedMovieCards - 1, readyContent.length - 1);
      remove(MoreButton);
    }
  }
});


