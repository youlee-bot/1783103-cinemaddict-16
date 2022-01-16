import ItemView from '../view/site-item-view';
import PopupView from '../view/site-popup-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../render';
import PopUpPresenter from './popup-presenter';

export default class SingleMoviePresenter {
  #filmListContainer = null;
  #movie = null;
  #comments = null;
  #bodyTag = null;
  #changeData = null;
  #movieComponent = null;
  #commentsModel = null;
  #moviesModel = null;
  #currentPopUp = null;

  constructor (filmListContainer, commentsModel, moviesModel, changedata) {
    this.#commentsModel = commentsModel;
    this.#moviesModel = moviesModel;
    this.#filmListContainer = filmListContainer;
    this.#changeData = changedata;
  }

  init (movie) {
    const prevMovie = this.#movieComponent;
    this.#movie = movie;
    this.#movieComponent = new ItemView(this.#movie);
    this.#movieComponent.setClickCallback (()=>{
      this.#showPopup(this.#movie);
    });
    this.#controlsSetHandlers(this.#movieComponent, this.#movie);
    this.#movieComponent.setClickHandler();

    if (prevMovie===null) {
      render (this.#filmListContainer, this.#movieComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#movieComponent, prevMovie);
  }

  destroy = () => {
    remove(this.#movieComponent);
  };

  #controlsSetHandlers = (component) => {
    component.setFavoriteCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
    });

    component.setWatchCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
    });

    component.setWatchlistCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
    });
  };

  #showPopup = (movieItem) => {
    const popUpPresenter = new PopUpPresenter (this.#moviesModel, this.#commentsModel, movieItem);
    popUpPresenter.init();
  }
}
