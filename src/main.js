import { readyComments, readyContent } from './mock/generator';
import MoviesModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import MovieListPresenter from './presenter/movie-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import { MenuItem } from './const';
import StatsView from './view/site-stats-view';
import { render, remove } from './render';
import { RenderPosition } from './render';

const mainTag = document.querySelector('.main');

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
moviesModel.movies = readyContent;


const commentsModel = new CommentsModel();
commentsModel.comments = readyComments;

const moviesListPresenter = new MovieListPresenter(mainTag, moviesModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(mainTag, filterModel, moviesModel);
let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case  MenuItem.MOVIES:
      remove(statsComponent);
      moviesListPresenter.destroy();
      moviesListPresenter.init();
      break;

    case MenuItem.STATS:
      moviesListPresenter.destroy();
      remove(statsComponent);
      statsComponent = new StatsView(moviesModel.watchedMovies);
      render (mainTag, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};


filterPresenter.init();
moviesListPresenter.init();

filterPresenter.setMenuClickHandler(handleSiteMenuClick);

