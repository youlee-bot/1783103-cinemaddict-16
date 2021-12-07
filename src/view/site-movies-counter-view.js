import { createElement } from '../render';

const createMoviesCounterTemplate = (content) => (`<p>${ content } movies inside</p>`);

export default class moviesView {
  #element = null;
  #content = null;

  constructor (content) {
    this.#content = content;
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createMoviesCounterTemplate(this.#content);
  }

  removeElement () {
    this.#element = null;
  }
}
