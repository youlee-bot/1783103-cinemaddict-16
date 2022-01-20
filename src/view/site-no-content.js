import AbstractView from './abstract-view';

const createNoContentTemplate = (text) => (`<h2 class="films-list__title">${ text }</h2>`);

export default class NoContent extends AbstractView{
  #filter = null;

  constructor (filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createNoContentTemplate(this.#filter);
  }
}

