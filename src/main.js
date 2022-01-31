import MoviesModel from './model/movies-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import MovieListPresenter from './presenter/movie-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import ApiService from './api-service';
import { AUTHORIZATION,END_POINT } from './const';

const mainTag = document.querySelector('.main');

const filterModel = new FilterModel();

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel(apiService);
const commentsModel = new CommentsModel(apiService);

const moviesListPresenter = new MovieListPresenter(mainTag, moviesModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(mainTag, filterModel, moviesModel, moviesListPresenter);

filterPresenter.init();
moviesListPresenter.init();

moviesModel.init();
