import { UpdateType } from '../const';
import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  loadComments = async (movieId) => {

    let comments;
    try {
      comments = await this.#apiService.getComments(movieId);

      this.#comments = comments.map((comment)=>({...comment, movieId:movieId,}));

    } catch (err) {
      comments = [];
    }

    this._notify(UpdateType.INIT, this.#comments);
    return this.#comments;
  }

  addComment = async(updateType, update) => {
    try {
      const {comments} = await this.#apiService.addComment(update, update.movieId);
      this.#comments = comments;
      this._notify(updateType, comments);
    } catch(err) {
      throw new Error(err);
    }
  }

  reInit = (updateType, update) => {
    this._notify(updateType, update);
  }

  deleteComment = async(updateType, update) => {
    const index = this.#comments.findIndex((comment) => (comment.id === update.id));

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update, update.id);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, this.#comments);
    } catch(err) {
      throw new Error(err);
    }
  }
}
