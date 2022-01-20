import ItemView from '../view/site-item-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../render';
import PopUpPresenter from './popup-presenter';

export default class SingleMoviePresenter {
  #filmListContainer = null;
  #movie = null;
  #changeData = null;
  #movieComponent = null;
  #commentsModel = null;
  #moviesModel = null;
  #bodyTag = null;


  constructor (bodyTag, filmListContainer, commentsModel, moviesModel, changedata) {
    this.#bodyTag = bodyTag;
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
    this.#controlsSetHandlers(this.#movieComponent);
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
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails:{...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
    });

    component.setWatchCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails:{...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
    });

    component.setWatchlistCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie, userDetails:{...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
    });
  };

  #showPopup = (movieItem) => {
    const popUpPresenter = new PopUpPresenter (this.#bodyTag, this.#moviesModel, this.#commentsModel, movieItem, this.#changeData);
    popUpPresenter.init();
  }
}
