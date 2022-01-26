import AbstractObservable from './abstract-observable';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  get watchedMovies() {
    return this.movies.filter((movie) => movie.userDetails.alreadyWatched);
  }

  updateMovie = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }
    this.#movies = [...this.#movies.slice(0, index), update, ...this.#movies.slice(index + 1),];
    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#movies.findIndex((movie) => movie.id === update.movieId);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._notify(updateType, update);
  }

  addComment = (updateType, update) => {

    const index = this.#movies.findIndex((movie) => movie.id === update.movieId);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._notify(updateType, update);
  }
}
