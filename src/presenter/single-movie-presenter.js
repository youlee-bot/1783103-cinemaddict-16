import ItemView from '../view/site-item-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition, replace } from '../render';
import CommentView from '../view/site-comment-view';
import PopupView from '../view/site-popup-view';
import dayjs from 'dayjs';
import he from 'he';

export default class SingleMoviePresenter {
  #filmListContainer = null;
  #movie = null;
  #movieId = null;
  #changeData = null;
  #prevPopUp = null;
  #commentsModel = null;
  #moviesModel = null;
  #bodyTag = null;
  #isLoading = true;

  #commentComponents = null;

  get movie () {
    const index = this.#moviesModel.movies.findIndex((movie) => movie.id === this.#movieId);
    return this.#moviesModel.movies[index];
  }

  constructor (bodyTag, filmListContainer, commentsModel, moviesModel, changedata, movieId) {
    this.#bodyTag = bodyTag;
    this.#commentsModel = commentsModel;
    this.#moviesModel = moviesModel;
    this.#filmListContainer = filmListContainer;
    this.#changeData = changedata;
    this.#movieId = movieId;
  }

  init (movieId) {
    this.#movie = this.movie;

    if (this.#prevPopUp) {
      this.#prevPopUp.removeElement();
      this.#showPopup(true);
    }

    const prevMovie = this.#prevPopUp;
    this.#movieId = movieId;
    this.#prevPopUp = new ItemView(this.#movie);
    this.#prevPopUp.setClickCallback (()=>{
      this.#showPopup(false);
    });
    this.#controlsSetHandlers(this.#prevPopUp);
    this.#prevPopUp.setClickHandler();

    if (!prevMovie) {
      render (this.#filmListContainer, this.#prevPopUp, RenderPosition.BEFOREEND);
      return;
    }
    replace(this.#prevPopUp, prevMovie);
  }

  destroy = () => {
    remove(this.#prevPopUp);
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

  #showPopup = async(refresh=false) => {
    if (!refresh) {
      if(PopupView.isOpenPoupView()) {
        return;
      }
    }
    let comments = [];
    this.#commentComponents = new Set();
    try {
      comments = await this.#commentsModel.loadComments(this.#movie.id);
    } catch (err) {
      comments = [];
    }

    this.#currentMovieComments(comments);
    this.#prevPopUp = new PopupView(this.movie, this.#commentComponents);

    render (this.#bodyTag, this.#prevPopUp, RenderPosition.BEFOREEND);
    this.#controlsSetHandlers(this.#prevPopUp);
    this.#setHandlersForActions();

  }

  #currentMovieComments = (comments) => {
    const movieComments = [];
    for (const index of comments) {
      movieComments.push(index);
      this.#commentComponents.add(new CommentView(index));
    }
    this.#commentComponents.forEach((commentComponent) => {
      commentComponent.setDeleteCallback(()=>{
        commentComponent.removeElement();
        this.#changeData(UserAction.DELETE_COMMENT, UpdateType.PATCH, {...commentComponent.content, movieId:this.#movie.id,});

      });
    });
    return movieComments;
  }

  #setHandlersForActions = () => {
    this.#prevPopUp.setSubmitCallback(()=>{
      if (this.#prevPopUp.commentText&&this.#prevPopUp.emotion) {
        this.#changeData(UserAction.UPDATE_MOVIE, UpdateType.PATCH, {...this.#movie});
        this.#changeData(UserAction.ADD_COMMENT, UpdateType.PATCH,
          {
            movieId: this.#movie.id,
            date:dayjs(),
            emotion: this.#prevPopUp.emotion,
            comment: he.encode(this.#prevPopUp.commentText),
          }
        );
      }
    });
    this.#prevPopUp.setCloseCallback(()=>this.#prevPopUp.removeElement());
  }
}
