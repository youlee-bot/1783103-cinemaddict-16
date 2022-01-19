import AbstractObservable from './abstract-observable';

export default class CommentsModel extends AbstractObservable {
  #comments = [];

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [update,...this.#comments,];
    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => {
      if ((comment.comment === update.comment)&(comment.date === comment.date)){
        return 1;
      }
     });

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
