import { readyComments, readyContent } from './mock/generator';

import MovieListPresenter from './presenter/movie-list-presenter';

const mainTag = document.querySelector('.main');

const moviesListPresenter = new MovieListPresenter(mainTag);

moviesListPresenter.init(readyContent, readyComments);

