
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

  init() {
    this.#commentsModel.loadComments(this.#movie.id);
    this.#commentsModel.addObserver(this.#updateComments);
    if (PopupView.isOpenPoupView()) {
      return;
    }
    this.#prevPopUp = new PopupView(this.movie, this.#commentComponents, this.removeObservers);
    this.#controlsSetHandlers(this.#prevPopUp);
    this.#prevPopUp.setSubmitCallback(({text, emoji})=>{
      if (text && emoji ) {
        const newComment = {
          comment: he.encode(text),
          emotion: emoji,
          date: dayjs(),
          author: 'Movie Buff',
          movieId: this.movie.id,
        };
        this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR, newComment);
      }
    });

    this.#prevPopUp.setCloseCallback(()=>this.destroy());
    this.#bodyTag.classList.add('hide-overflow');

    render (this.#bodyTag, this.#prevPopUp, RenderPosition.BEFOREEND);
  }

  destroy = () => {
    this.removeObservers();
    remove(this.#prevPopUp);
  }

  removeObservers = () => {
    this.#commentsModel.removeObserver(this.#updateComments);
  }

  setViewStateDisable = () => {
    this.#prevPopUp.setStateDisable();
  }

  setViewStateEnabled = () => {
    this.#prevPopUp.setStateEnable();
  }

  setShaking = () => {
    this.#prevPopUp.shake();
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

  #handleViewAction = async(actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT: {
        this.setViewStateDisable();
        this.#movie.commentsIds.push(update.id);
        try {
          await this.#commentsModel.addComment(updateType, update);
          this.setViewStateEnabled();
        } catch(err) {
          this.setShaking();
        }
        break;
      }
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  #updateComments = (updateType, data) => {
    this.#commentComponents = new Set();
    for (const comment of data) {
      const commentComponent = new CommentView(comment);
      commentComponent.setDeleteCallback(()=>{
        this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, {...commentComponent.content, movieId:this.#movie.id,});
      });
      this.#commentComponents.add(commentComponent);
    }
    this.#prevPopUp.parseCommentToData(this.#commentComponents);
    this.#prevPopUp.renderComments();
  }
}
