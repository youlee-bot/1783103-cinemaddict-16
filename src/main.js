import { readyComments, readyContent } from './mock/generator';
import MoviesModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import MovieListPresenter from './presenter/movie-list-presenter';
import FilterPresenter from './presenter/filter-presenter';

const mainTag = document.querySelector('.main');

const filterModel = new FilterModel();
const moviesModel = new MoviesModel();
moviesModel.movies = readyContent;

const commentsModel = new CommentsModel();
commentsModel.comments = readyComments;

const moviesListPresenter = new MovieListPresenter(mainTag, moviesModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(mainTag, filterModel, moviesModel);
filterPresenter.init();
moviesListPresenter.init();

