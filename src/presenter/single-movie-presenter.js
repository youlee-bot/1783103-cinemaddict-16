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

    controlsSetHandlers(currentMovie, this.#movie);
    currentMovie.setClickHandler();
    this.#bodyTag = document.querySelector('body');
  }

  #showPopup = (movieItem, comments) => {
    const currentPopup = new PopupView(movieItem, comments);

    controlsSetHandlers(currentPopup, this.#movie);
    currentPopup.setCloseCallback(()=>currentPopup.removeElement());
    currentPopup.removeElement();

    this.#bodyTag.classList.add('hide-overflow');
    this.#bodyTag.appendChild(currentPopup.element);
  }
}
