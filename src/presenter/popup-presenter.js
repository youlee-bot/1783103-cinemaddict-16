
import { UserAction,UpdateType } from '../const';
import PopupView from '../view/site-popup-view';
import CommentView from '../view/site-comment-view';

export default class PopUpPresenter {
  #movie = null;
  #commentsModel = null;
  #moviesModel = null;
  #bodyTag = null;
  #prevPopUp = null;
  #comments = null;
  #commentComponents = new Set();

  constructor (moviesModel, commentsModel, movie) {
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#movie = movie;
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  init (reInit=false) {
    if (reInit) {
      this.#prevPopUp.removeElement();
      this.#commentComponents = new Set();
    } else {
      this.#comments = this.#commentsModel.comments;
    }


    this.#currentMovieComments(this.#comments);
    const currentPopup = new PopupView(this.#movie, this.#commentComponents);

    if (!reInit) {
      this.#prevPopUp = currentPopup;
    }

    this.#bodyTag = document.querySelector('body');

    this.#controlsSetHandlers(currentPopup);
    currentPopup.setSubmitCallback(()=>this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH,
      {
        movieId: this.#movie.id,
        author: 'admin',
        date:'2021-12-16T03:41:49+08:00',
        emotion: currentPopup.emotion,
        comment: currentPopup.commentText,
      }
    ));
    currentPopup.setCloseCallback(()=>currentPopup.removeElement());
    this.#bodyTag.classList.add('hide-overflow');



    if(PopupView.isOpenPoupView()) {
      return;
    }

    this.#bodyTag.appendChild(currentPopup.element);

  }

  #controlsSetHandlers = (component) => {
    component.setFavoriteCallback (()=>{
      this.#handleViewAction(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
    });

    component.setWatchCallback (()=>{
      this.#handleViewAction(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
    });

    component.setWatchlistCallback (()=>{
      this.#handleViewAction(UserAction.UPDATE_MOVIE, UpdateType.MAJOR, {...this.#movie, userDetails:{...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
    });
  };

  #currentMovieComments = (comments) => {
    const movieComments = [];
    for (const index of comments) {
      if (index.movieId===this.#movie.id) {
        movieComments.push(index);
        this.#commentComponents.add(new CommentView(index));
      }
    }
    this.#commentComponents.forEach(commentComponent => {
      commentComponent.setDeleteCallback(()=>this.removeElement());
    });
    return movieComments;
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
        this.#comments = [data, ...this.#comments];
        this.init(true);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
    }
  }
}
