import BoardView from '../view/site-board-view';
import SortView from '../view/site-sort-view';
import ButtonView from '../view/site-show-more-button-view';
import ExtraView from '../view/site-extra-view';
import MoviesView from '../view/site-movies-counter-view';
import { render, RenderPosition, remove } from '../render';
import RatingView from '../view/site-user-rating-view';
import SingleMoviePresenter from './single-movie-presenter';
import NoContent from '../view/site-no-content';
import { sortByField, sortByDate } from './utils';
import { UserAction, UpdateType, SortType, FilterType, noContenTexts } from '../const';
import { filter } from '../site-utils';

export default class MovieListPresenter {
  #boardContainer = null;
  #filmListContainer = null;
  #currentSortType = SortType.DEFAULT;
  #filmListTag = null;
  #filterType = FilterType.ALL;
  #boardComponent =  new BoardView();
  #moreButtonComponent = new ButtonView();
  #sortComponent = null;
  #SingleMoviePresenter = new Map();

  #moviesToShowPerStep = 5;
  #displayedMovieCards = 5;

  #moviesModel = null;
  #commentsModel = null;
  #filterModel = null;

  constructor (movieList, movies, comments, filterModel) {
    this.#boardContainer = movieList;
    this.#moviesModel = movies;
    this.#commentsModel = comments;
    this.#filterModel = filterModel;
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies () {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](movies);
    const sortedByDate = [...filteredMovies];
    const sortedByRating = [...filteredMovies];

    switch (this.#currentSortType) {
      case SortType.DATE:
        return sortedByDate.sort(sortByDate);
      case SortType.RATING:
        return sortedByRating.sort(sortByField('totalRating'));
    }

    return filteredMovies;
  }

  get topCommented () {
    const topCommented = [...this.#moviesModel.movies]
    return topCommented.sort(sortByField('comments'));
  }

  get topRated () {
    const topRated = [...this.#moviesModel.movies]
    return topRated.sort(sortByField('totalRating'));
  }

  init = (moviesToShow=this.movies, reinit=false) => {
    render (this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    this.#filmListContainer = BoardView.getBoardContainerTag();
    this.#filmListTag = BoardView.getFilmListTag();
    if (this.movies.length===0) {
      this.#renderNoContent(this.#filterType);
      return;
    }

    if (!reinit) {
      this.#renderMoviesCounter();
      this.#renderRating();
    }

    this.#renderMovieItems(0, this.#displayedMovieCards);

    this.#renderTopCommented();
    this.#renderTopRated();
    this.#renderSort();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.init(this.#displayedMovieCards, true);
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render (this.#filmListContainer, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderNoContent = () => {
    render (this.#filmListContainer, new NoContent(noContenTexts?.[this.#filterType]), RenderPosition.AFTERBEGIN);
  }

  #renderMovieItems = (start, end, moviesContent = this.movies, container = this.#filmListContainer) => {

    for (let i = start; i < end; i++) {
      this.#renderMovieitem(moviesContent[i], container);
    }
    this.#renderShowMoreButton();
  }

  #renderMovieitem = (movieItem, container) => {
    if (!movieItem) {
      return;
    }
    const MoviePresenter = new SingleMoviePresenter(container, this.#commentsModel, this.#handleViewAction);
    MoviePresenter.init(movieItem);
    this.#SingleMoviePresenter.set(movieItem.id, MoviePresenter);
  }

  #clearBoard = () => {
    this.#SingleMoviePresenter.forEach((presenter) => presenter.destroy());
    this.#SingleMoviePresenter.clear();
    remove(this.#boardComponent);
  }

  #renderRating = () => {
    const headerTag = document.querySelector('.header');
    render (headerTag, new RatingView(), RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {
    render (this.#filmListTag, this.#moreButtonComponent, RenderPosition.BEFOREEND);
    this.#moreButtonComponent.setClickHandler(()=>{
      if (this.movies.length > this.#displayedMovieCards) {
        const hidedMovieCards = this.movies.length - this.#displayedMovieCards;
        if (hidedMovieCards >= this.#moviesToShowPerStep) {
          this.#renderMovieItems(this.#displayedMovieCards - 1, this.#displayedMovieCards-1 + this.#moviesToShowPerStep);
          this.#displayedMovieCards+=this.#moviesToShowPerStep;
        }
        else if (hidedMovieCards < this.#moviesToShowPerStep) {
          this.#renderMovieItems(this.#displayedMovieCards - 1, this.movies.length - 1);
          this.#displayedMovieCards+=this.movies.length - 1 - this.#displayedMovieCards - 1;
          remove(this.#moreButtonComponent);
        }
      }
    });
  }

  #renderTopRated = () => {
    render (this.#filmListTag, new ExtraView('Top Rated', 'top-rated'), RenderPosition.AFTEREND);
    this.#renderMovieItems(0,2,this.topRated,ExtraView.getExtraTag('top-rated'));
  }

  #renderTopCommented = () => {
    render (this.#filmListTag, new ExtraView('Top Commented', 'top-commented'), RenderPosition.AFTEREND);
    this.#renderMovieItems(0,2,this.topCommented,ExtraView.getExtraTag('top-commented'));
  }

  #renderMoviesCounter = () => {
    const footerTag = BoardView.getFooterTag();
    render (footerTag, new MoviesView(this.#moviesModel.movies.length), RenderPosition.BEFOREEND);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#SingleMoviePresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#displayedMovieCards = 5;
        this.#currentSortType = SortType.DEFAULT;
        this.init(this.#displayedMovieCards, true);
        break;
    }
  }

}
