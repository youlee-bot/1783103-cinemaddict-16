import ItemView from '../view/site-item-view';
import PopupView from '../view/site-popup-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../render';

export default class SingleMoviePresenter {
  #filmListContainer = null;
  #movie = null;
  #comments = null;
  #bodyTag = null;
  #changeData = null;
  #movieComponent = null;
  #commentsModel = null;
  #currentPopUp = null;

  constructor (filmListContainer, commentsModel, changedata) {
    this.#commentsModel = commentsModel;
    this.#filmListContainer = filmListContainer;
    this.#changeData = changedata;
    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init (movie) {
    const prevMovie = this.#movieComponent;
    this.#movie = movie;
    this.#movieComponent = new ItemView(this.#movie);
    this.#movieComponent.setClickCallback (()=>{
      this.#showPopup(this.#movie, this.#currentMovieComments());
    });
    this.#controlsSetHandlers(this.#movieComponent, this.#movie);
    this.#movieComponent.setClickHandler();
    this.#bodyTag = document.querySelector('body');
    if (prevMovie===null) {
      render (this.#filmListContainer, this.#movieComponent, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#movieComponent, prevMovie);
  }

  destroy = () => {
    remove(this.#movieComponent);
  };

  #currentMovieComments = () => {
    const movieComments = [];

    for (const index of this.#commentsModel.comments) {
      if (index.movieId===this.#movie.id) {
        movieComments.push(index);
      }
    }

    return movieComments;
  }

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
    if(PopupView.isOpenPoupView()) {
      return;
    }

    this.#currentPopUp = new PopupView(movieItem, this.#currentMovieComments())

    const currentPopup = this.#currentPopUp;
    this.#controlsSetHandlers(currentPopup);
    currentPopup.setSubmitCallback(()=>this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH,
      {
      modieId: this.#movie.id,
      author: 'admin',
      date:'2021-12-16T03:41:49+08:00',
      emotion: currentPopup.emotion,
      comment: currentPopup.commentText,
    }
    ));
    currentPopup.setCloseCallback(()=>currentPopup.removeElement());
    this.#bodyTag.classList.add('hide-overflow');
    this.#bodyTag.appendChild(currentPopup.element);

  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        //this.#currentPopUp.removeElement();
        this.#showPopup(this.#movie);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
    }
  }
}
