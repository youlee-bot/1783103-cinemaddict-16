import AbstractObservable from './abstract-observable';
import { UpdateType } from '../const';

export default class MoviesModel extends AbstractObservable {
  #movies = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch (err) {
      this.#movies=[];
    }

    this._notify(UpdateType.INIT);
  }

  get movies() {
    return this.#movies;
  }

  get watchedMovies() {
    return this.movies.filter((movie) => movie.userDetails.alreadyWatched);
  }

  updateMovie = async (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedMovie = this.#adaptToClient(response);
      this.#movies = [...this.#movies.slice(0, index), updatedMovie, ...this.#movies.slice(index + 1),];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t update movie');
    }
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie['film_info'],
      id: movie['id'],
      alternativeTitle: movie['film_info']['alternative_title'],
      totalRating: movie['film_info']['total_rating'],
      ageRating: movie['film_info']['age_rating'],
      release: {
        date: new Date (movie['film_info']['release']['date']),
        releaseCountry: movie['film_info']['release']['release_country'],
      },
      comments: movie['comments'].length,
      userDetails: {
        watchlist: movie['user_details']['watchlist'],
        alreadyWatched: movie['user_details']['already_watched'],
        favorite: movie['user_details']['favorite'],
        watchingDate: new Date (movie['user_details']['watching_date']),
      },
      commentsIds:movie['comments'],
    };

    delete adaptedMovie['alternative_title'];
    delete adaptedMovie['total_rating'];
    delete adaptedMovie['age_rating'];

    return adaptedMovie;
  }

  addComment = (updateType, update) => {

    const index = this.#movies.findIndex((movie) => movie.id === update.movieId);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._notify(updateType, update);
  }
}

