import BoardView from '../view/site-board-view';
import SortView from '../view/site-sort-view';
import SiteMenuView from '../view/site-menu-view';
import ButtonView from '../view/site-show-more-button-view';
import ExtraView from '../view/site-extra-view';
import MoviesView from '../view/site-movies-counter-view';
import { render, RenderPosition, remove } from '../render';
import RatingView from '../view/site-user-rating-view';
import SingleMoviePresenter from './single-movie-presenter';

export default class MovieListPresenter {
  #boardContainer = null;
  #filmListContainer = null;
  #filmListTag = null;

  #boardComponent =  new BoardView();
  #sortComponent = new SortView();
  #menuComponent = new SiteMenuView();
  #moreButtonComponent = new ButtonView();

  #moviesToShow = 5;
  #moviesToShowPerStep = 5;
  #extraCounter = 2;
  #displayedMovieCards = 0;
  #moviesToDisplay = [];
  #moviesComments = [];

  constructor (movieList) {
    this.#boardContainer = movieList;
  }

  init = (movies, comments) => {
    this.#moviesToDisplay = [...movies];
    this.#moviesComments = [...comments];

    render (this.#boardContainer, this.#boardComponent, RenderPosition.AFTERBEGIN);
    render (this.#boardContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
    render (this.#boardContainer, this.#menuComponent, RenderPosition.AFTERBEGIN );
    this.#renderMovieItems(0, this.#moviesToShow);
    this.#renderMoviesCounter();
    this.#renderRating();


    this.#renderExtra();
  }

  #renderMovieItems = (start, end) => {
    this.#filmListContainer = this.#boardContainer.querySelector('.films-list__container');
    this.#filmListTag = document.querySelector('.films-list');
    for (let i = start; i < end; i++) {
      this.#renderMovieitem(this.#moviesToDisplay[i]);
      this.#displayedMovieCards++;
    }
    this.#renderShowMoreButton();
  }

  #renderMovieitem = (movieItem) => {
    const MoviePresenter = new SingleMoviePresenter(this.#filmListContainer, movieItem, this.#prepareComments(movieItem.id));
    MoviePresenter.init();
  }

  #prepareComments = (movieId) => {
    const movieComments = [];
    for (const index of this.#moviesComments) {
      if (index.movieId===movieId) {
        movieComments.push(index);
      }
    }
    return movieComments;
  }

  #renderRating = () => {
    const headerTag = document.querySelector('.header');
    render (headerTag, new RatingView(), RenderPosition.BEFOREEND);
  }

  #renderShowMoreButton = () => {
    render (this.#filmListContainer, this.#moreButtonComponent, RenderPosition.BEFOREEND);
    this.#moreButtonComponent.setClickHandler(()=>{
      if (this.#moviesToDisplay.length > this.#displayedMovieCards) {
        const hidedMovieCards = this.#moviesToDisplay.length - this.#displayedMovieCards;
        if (hidedMovieCards >= this.#moviesToShowPerStep) {
          this.#renderMovieItems(this.#displayedMovieCards - 1, this.#displayedMovieCards-1 + this.#moviesToShowPerStep);
        }
        if (hidedMovieCards < this.#moviesToShowPerStep) {
          this.#renderMovieItems(this.#displayedMovieCards - 1, this.#moviesToDisplay.length - 1);
          remove(this.#moreButtonComponent);
        }
      }
    });
  }

  #renderExtra = () => {

    for (let i = 0; i < this.#extraCounter; i++) {
      render (this.#filmListTag, new ExtraView(this.#moviesToDisplay[i]), RenderPosition.AFTEREND);
    }
  }

  #renderMoviesCounter = () => {
    const footerTag = document.querySelector('.footer__statistics');
    render (footerTag, new MoviesView(this.#moviesToDisplay.length), RenderPosition.BEFOREEND);
  }
}
