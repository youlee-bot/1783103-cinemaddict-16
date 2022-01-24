
import { UserAction,UpdateType } from '../const';
import PopupView from '../view/site-popup-view';
import CommentView from '../view/site-comment-view';
import { render, remove } from '../render';
import { RenderPosition } from '../render';
import dayjs from 'dayjs';
import he from 'he';

export default class PopUpPresenter {
  #movie = null;
  #commentsModel = null;
  #moviesModel = null;
  #bodyTag = null;
  #prevPopUp = null;
  #comments = null;
  #commentComponents = new Set();
  #changeData = null;

  constructor (bodyTag, moviesModel, commentsModel, movie, changeData) {
    this.#bodyTag = bodyTag;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;
    this.#movie = movie;
    this.#changeData = changeData;
  }

  get movie () {
    const index = this.#moviesModel.movies.findIndex((movie) => movie.id === this.#movie.id);
    return this.#moviesModel.movies[index];
  }

  init (reInit=false) {
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#changeData);
    this.#moviesModel.addObserver(this.#handleMovieModelEvent);

    if (reInit) {
      this.#prevPopUp.removeElement();
      this.#commentComponents = new Set();
    } else {
      this.#comments = this.#commentsModel.comments;
    }

    this.#currentMovieComments(this.#comments);
    this.#prevPopUp = new PopupView(this.movie, this.#commentComponents);

    this.#controlsSetHandlers(this.#prevPopUp);
    this.#prevPopUp.setSubmitCallback(()=>{
      if (this.#prevPopUp.commentText&&this.#prevPopUp.emotion) {

        this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR,
          {
            movieId: this.movie.id,
            author: 'admin',
            date:dayjs(),
            emotion: this.#prevPopUp.emotion,
            comment: he.encode(this.#prevPopUp.commentText),
          }
        );
        this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, comments: this.movie.comments+1,});
      }
    });
    this.#prevPopUp.setCloseCallback(()=>this.#prevPopUp.removeElement());
    this.#bodyTag.classList.add('hide-overflow');

    if(PopupView.isOpenPoupView()) {
      return;
    }

    render (this.#bodyTag, this.#prevPopUp, RenderPosition.BEFOREEND);
  }

  destroy = () => {
    this.#commentsModel.removeObserver(this.#handleModelEvent);
    this.#moviesModel.removeObserver(this.#changeData);
    this.#moviesModel.removeObserver(this.#handleMovieModelEvent);
    remove(this.#prevPopUp);
  }

  #controlsSetHandlers = (component) => {
    component.setFavoriteCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, favorite: !this.movie.userDetails.favorite}});
      this.#handlePopUpViewAction(UserAction.REINIT, UpdateType.PATCH,{});
    });

    component.setWatchCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched}});
      this.#handlePopUpViewAction(UserAction.REINIT, UpdateType.PATCH,{});
    });

    component.setWatchlistCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist}});
      this.#handlePopUpViewAction(UserAction.REINIT, UpdateType.PATCH,{});
    });
  };

  #currentMovieComments = (comments) => {
    const movieComments = [];
    for (const index of comments) {
      if (index.movieId===this.movie.id) {
        movieComments.push(index);
        this.#commentComponents.add(new CommentView(index));
      }
    }
    this.#commentComponents.forEach((commentComponent) => {
      commentComponent.setDeleteCallback(()=>{
        commentComponent.removeElement();

        this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, comments: this.movie.comments-1,});
        this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, commentComponent.content);
      });
    });
    return movieComments;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#moviesModel.addComment(updateType, update);
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#moviesModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#comments = this.#commentsModel.comments;
        this.init(true);
        break;
      case UpdateType.MAJOR:
        this.#comments = [data, ...this.#comments];
        this.init(true);
        break;
    }
  }

  #handlePopUpViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.REINIT:
        this.#commentsModel.reInit(updateType, update);
        break;
    }
  }

  #handleMovieModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(true);
        this.#comments = this.#commentsModel.comments;
        break;
    }
  }
}
