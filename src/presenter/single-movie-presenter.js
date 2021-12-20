import ItemView from '../view/site-item-view';
import PopupView from '../view/site-popup-view';

import { render, RenderPosition } from '../render';
import { controlsSetHandlers } from './utils';

export default class SingleMoviePresenter {
  #filmListContainer = null;
  #movie = null;
  #comments = null;
  #bodyTag = null;

  constructor (filmListContainer, movie, comments){
    this.#movie = movie;
    this.#comments = comments;
    this.#filmListContainer = filmListContainer;
  }

  init () {
    const currentMovie = new ItemView(this.#movie);
    render (this.#filmListContainer, currentMovie, RenderPosition.BEFOREEND);

    currentMovie.setClickCallback (()=>{
      this.#showPopup(this.#movie, this.#comments);
    });

    controlsSetHandlers(currentMovie, this.#movie.id);
    currentMovie.setClickHandler();
    this.#bodyTag = document.querySelector('body');
  }

  #showPopup = (movieItem, comments) => {
    const thisPopup = new PopupView(movieItem, comments);

    controlsSetHandlers(thisPopup, this.#movie.id);

    thisPopup.setClickCallback (()=>{
    });

    thisPopup.setClickHandler();

    const closePopup = () => {
      const popupElement = document.querySelector('.film-details');
      if (popupElement) {
        this.#bodyTag.removeChild(thisPopup.element);
        this.#bodyTag.classList.remove('hide-overflow');
      }
    };

    closePopup();
    this.#bodyTag.classList.add('hide-overflow');
    this.#bodyTag.appendChild(thisPopup.element);

    const closeButton = thisPopup.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => closePopup());
  }
}
