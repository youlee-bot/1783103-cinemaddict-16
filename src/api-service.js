/* eslint-disable camelcase */
import { Method } from './const';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = (movieId) => this.#load({url: `comments/${movieId}`}).then(ApiService.parseResponse);

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptMovieToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  addComment = async (comment, movieId) => {
    const response = await this.#load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  deleteComment = async (comment, movieId) => {
    const response = await this.#load({
      url: `comments/${movieId}`,
      method: Method.DELETE,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptMovieToServer = (movie) => {
    const adaptedMovie = {
      id: movie['id'],
      film_info: {...movie,
        alternative_title: movie['alternativeTitle'],
        total_rating: movie['totalRating'],
        age_rating: movie['ageRating'],
        release: {
          date: movie['release']['date'].toISOString(),
          release_country: movie['release']['releaseCountry']
        },
      },
      user_details: {... movie['userDetails'],
        already_watched: movie['userDetails']['alreadyWatched'],
        watching_date: movie['userDetails']['watchingDate'],
      },
      comments: movie['commentsIds'],
    };

    delete adaptedMovie['film_info']['alternativeTitle'];
    delete adaptedMovie['film_info']['totalRating'];
    delete adaptedMovie['film_info']['ageRating'];

    return adaptedMovie;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
