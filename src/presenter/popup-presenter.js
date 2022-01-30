
import { UserAction,UpdateType } from '../const';
import PopupView from '../view/site-popup-view';
import CommentView from '../view/site-comment-view';
import { render, remove } from '../render';
import { RenderPosition } from '../render';
import dayjs from 'dayjs';
import he from 'he';
import { nanoid } from 'nanoid';

export default class PopUpPresenter {
  #movie = null;
  #commentsModel = null;
  #moviesModel = null;
  #bodyTag = null;
  #prevPopUp = null;
  #comments = null;
  #commentComponents = new Set();
  #changeData = null;
  #isLoading = true;
  #lastAddedComment = null;
  #allHandlers = new Set();

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
    if (!reInit) {

    }
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#moviesModel.addObserver(this.#changeData);
    this.#moviesModel.addObserver(this.#handleMovieModelEvent);


    if (this.#isLoading) {
      this.#commentsModel.loadComments(this.#movie.id);
    } else {
      this.#comments = this.#commentsModel.comments;


      if (reInit) {
        if (this.#prevPopUp) {
          this.#prevPopUp.removeElement();
        }
        this.#commentComponents = new Set();
      }

      this.#currentMovieComments(this.#comments);
      this.#prevPopUp = new PopupView(this.movie, this.#commentComponents, this.removeObservers, this.#setHandlersForActions);

      this.#allHandlers.add(this.#setHandlersForActions);
      console.log(this.#allHandlers);

    this.#controlsSetHandlers(this.#prevPopUp);
    this.#prevPopUp.setCloseCallback(()=>this.#prevPopUp.removeElement());

      this.#bodyTag.classList.add('hide-overflow');
      if(PopupView.isOpenPoupView()) {
        return;
      }
      render (this.#bodyTag, this.#prevPopUp, RenderPosition.BEFOREEND);
    }
  }

  destroy = () => {
    this.removeObservers();
    remove(this.#prevPopUp);
  }

  #setHandlersForActions = () => {
      this.#prevPopUp.setSubmitCallback(()=>{
        if (this.#prevPopUp.commentText&&this.#prevPopUp.emotion) {
          this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, comments: this.movie.comments+1,});
          this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR,
            {
              movieId: this.movie.id,
              author: 'Movie Buff',
              date:dayjs(),
              emotion: this.#prevPopUp.emotion,
              comment: he.encode(this.#prevPopUp.commentText),
            }
          );
        }
      });
  }

  removeObservers = () => {
    this.#commentsModel.removeObserver(this.#handleModelEvent);
    this.#moviesModel.removeObserver(this.#changeData);
    //this.#moviesModel.removeObserver(this.#handleMovieModelEvent);
  }

  #controlsSetHandlers = (component) => {
    component.setFavoriteCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, favorite: !this.movie.userDetails.favorite}});
    });

    component.setWatchCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, alreadyWatched: !this.movie.userDetails.alreadyWatched}});
    });

    component.setWatchlistCallback (()=>{
      this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.movie, userDetails:{...this.movie.userDetails, watchlist: !this.movie.userDetails.watchlist}});
    });
  };

  #currentMovieComments = (comments) => {
    const movieComments = [];
    if (!this.#isLoading) {
      for (const index of comments) {
        movieComments.push(index);
        this.#commentComponents.add(new CommentView(index));
      }
      this.#commentComponents.forEach((commentComponent) => {
        commentComponent.setDeleteCallback(()=>{
          commentComponent.removeElement();
          this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, {...commentComponent.content, movieId:this.#movie.id,});
          this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, {...commentComponent.content, movieId:this.#movie.id,});
        });
      });
      return movieComments;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {

    switch (actionType) {
      case UserAction.ADD_COMMENT:
        const newCommentId = nanoid();
        this.#movie.commentsIds.push(newCommentId);
        this.#moviesModel.updateMovie(updateType, this.#movie);
        this.#commentsModel.addComment(updateType, {...update, id:newCommentId,});
        this.#lastAddedComment = update;
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        this.#movie.commentsIds = this.#movie.commentsIds.filter((commentId) => commentId!==update.id);
        this.#moviesModel.updateMovie(updateType, this.#movie);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType);
    switch (updateType) {
      case UpdateType.INIT:
        console.log('reinit');
        this.#isLoading=false;
        this.init(true);
        this.#isLoading=true;
        break;
      case UpdateType.MINOR:
        this.#isLoading=false;
        this.init(true);
        this.#isLoading=true;
        break;
      case UpdateType.MAJOR:
        this.#comments = [data, ...this.#comments];
        this.init(true);
        break;
    }
  }

  #handleMovieModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.init(true);
        break;
    }
  }
}
